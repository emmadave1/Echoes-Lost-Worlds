import { useEffect, useRef } from "react";
import type { PortalId } from "./portals.config";

type LayerId = PortalId | "museum";

type Layer = {
  gain: GainNode;
  nodes: AudioNode[];
  stop: () => void;
};

const FADE = 1.4;

export default function AudioManager({
  audioOn,
  activePortal,
  stage,
}: {
  audioOn: boolean;
  activePortal: PortalId | null;
  stage: string;
}) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const layersRef = useRef<Partial<Record<LayerId, Layer>>>({});
  const currentRef = useRef<LayerId | null>(null);

  // Master mute
  useEffect(() => {
    const ac = ctxRef.current;
    const master = masterRef.current;
    if (!ac || !master) return;
    const t = ac.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.linearRampToValueAtTime(audioOn ? 0.6 : 0.0001, t + 0.6);
    if (audioOn && ac.state === "suspended") ac.resume();
  }, [audioOn]);

  // Which layer to play
  useEffect(() => {
    if (!audioOn) return;
    // Lazy-init audio context on first user-enabled state
    if (!ctxRef.current) {
      const AC =
        (
          window as unknown as {
            AudioContext?: typeof AudioContext;
            webkitAudioContext?: typeof AudioContext;
          }
        ).AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      ctxRef.current = ac;
      const master = ac.createGain();
      master.gain.value = 0.0001;
      master.connect(ac.destination);
      masterRef.current = master;
      // fade master in
      const t = ac.currentTime;
      master.gain.linearRampToValueAtTime(0.6, t + 0.6);
    }

    const ac = ctxRef.current!;
    const master = masterRef.current!;

    const target: LayerId = stage === "scene" && activePortal ? activePortal : "museum";
    if (currentRef.current === target) return;

    // Ensure target layer exists
    if (!layersRef.current[target]) {
      layersRef.current[target] = buildLayer(ac, master, target);
    }
    // Fade out previous
    const prev = currentRef.current;
    if (prev && layersRef.current[prev]) {
      const g = layersRef.current[prev]!.gain;
      const t = ac.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.linearRampToValueAtTime(0.0001, t + FADE);
    }
    // Fade in target
    const g = layersRef.current[target]!.gain;
    const t = ac.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.linearRampToValueAtTime(layerVolume(target), t + FADE);
    currentRef.current = target;
  }, [audioOn, activePortal, stage]);

  useEffect(() => {
    return () => {
      const ac = ctxRef.current;
      if (!ac) return;
      Object.values(layersRef.current).forEach((l) => l?.stop());
      ac.close().catch(() => {});
    };
  }, []);

  return null;
}

function layerVolume(id: LayerId): number {
  switch (id) {
    case "museum":
      return 0.35;
    case "neotokyo":
      return 0.28;
    case "unknown":
      return 0.32;
    default:
      return 0.4;
  }
}

function buildLayer(ac: AudioContext, dest: AudioNode, id: LayerId): Layer {
  const gain = ac.createGain();
  gain.gain.value = 0.0001;
  gain.connect(dest);
  const nodes: AudioNode[] = [gain];
  const stops: Array<() => void> = [];

  const addOsc = (
    type: OscillatorType,
    freq: number,
    vol: number,
    detune = 0,
    filterFreq?: number,
  ) => {
    const osc = ac.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const g = ac.createGain();
    g.gain.value = vol;
    let out: AudioNode = g;
    if (filterFreq) {
      const f = ac.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = filterFreq;
      osc.connect(f);
      f.connect(g);
      nodes.push(f);
    } else {
      osc.connect(g);
    }
    g.connect(gain);
    osc.start();
    nodes.push(osc, g);
    stops.push(() => {
      try {
        osc.stop();
      } catch {}
    });
    return { osc, g };
  };

  const addNoise = (vol: number, filterFreq: number, type: BiquadFilterType = "lowpass") => {
    const bufferSize = 2 * ac.sampleRate;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const f = ac.createBiquadFilter();
    f.type = type;
    f.frequency.value = filterFreq;
    const g = ac.createGain();
    g.gain.value = vol;
    src.connect(f);
    f.connect(g);
    g.connect(gain);
    src.start();
    nodes.push(src, f, g);
    stops.push(() => {
      try {
        src.stop();
      } catch {}
    });
    return { src, f, g };
  };

  switch (id) {
    case "museum": {
      addOsc("sine", 110, 0.15);
      addOsc("sine", 164.81, 0.08, 5);
      addNoise(0.02, 600);
      break;
    }
    case "atlantis": {
      // deep water: filtered noise with LFO on filter
      const n = addNoise(0.35, 500);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ac.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(n.f.frequency);
      lfo.start();
      nodes.push(lfo, lfoGain);
      stops.push(() => {
        try {
          lfo.stop();
        } catch {}
      });
      addOsc("sine", 65, 0.18);
      break;
    }
    case "neotokyo": {
      // detuned saw synth
      addOsc("sawtooth", 82.4, 0.06, -8, 1200);
      addOsc("sawtooth", 82.4, 0.06, 8, 1200);
      addOsc("square", 164.8, 0.03, 0, 900);
      addNoise(0.04, 3000, "highpass");
      break;
    }
    case "verdantis": {
      // forest: soft pad + chirps
      addOsc("sine", 220, 0.08);
      addOsc("sine", 329.6, 0.05, 4);
      // chirps
      const interval = setInterval(() => {
        const now = ac.currentTime;
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(1800 + Math.random() * 800, now);
        o.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        const g = ac.createGain();
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(0.08, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        o.connect(g);
        g.connect(gain);
        o.start(now);
        o.stop(now + 0.3);
      }, 2200);
      stops.push(() => clearInterval(interval));
      break;
    }
    case "celestia": {
      // sky: bright pad + occasional bird
      addOsc("sine", 261.6, 0.08);
      addOsc("sine", 392, 0.06, 3);
      addOsc("triangle", 523.25, 0.03);
      const interval = setInterval(() => {
        const now = ac.currentTime;
        const o = ac.createOscillator();
        o.type = "triangle";
        o.frequency.setValueAtTime(2200, now);
        o.frequency.linearRampToValueAtTime(2600, now + 0.1);
        o.frequency.linearRampToValueAtTime(2000, now + 0.2);
        const g = ac.createGain();
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(0.05, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        o.connect(g);
        g.connect(gain);
        o.start(now);
        o.stop(now + 0.4);
      }, 3500);
      stops.push(() => clearInterval(interval));
      break;
    }
    case "unknown": {
      // eerie drone
      addOsc("sine", 55, 0.22);
      addOsc("sine", 58, 0.15);
      addOsc("triangle", 220, 0.04, 0, 500);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.08;
      const lfoGain = ac.createGain();
      lfoGain.gain.value = 8;
      lfo.connect(lfoGain);
      // detune drift
      lfo.start();
      nodes.push(lfo, lfoGain);
      stops.push(() => {
        try {
          lfo.stop();
        } catch {}
      });
      break;
    }
    case "mars": {
      // Deep planetary drones and distant desert winds.
      addOsc("sine", 55, 0.16);
      const drone = addOsc("triangle", 82.4, 0.07, -4, 500);
      addNoise(0.035, 350);

      // Slowly shift the second drone's pitch.
      const lfo = ac.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.08;

      const lfoGain = ac.createGain();
      lfoGain.gain.value = 4;

      lfo.connect(lfoGain);
      lfoGain.connect(drone.osc.detune);

      lfo.start();

      nodes.push(lfo, lfoGain);

      stops.push(() => {
        try {
          lfo.stop();
        } catch {}
      });

      break;
    }

    case "earth": {
      // Earth: a warm, peaceful atmosphere with a gentle airy texture.
      addOsc("sine", 130.81, 0.07);
      addOsc("sine", 196, 0.045, 3);
      addOsc("sine", 261.63, 0.025, -2);
      addNoise(0.012, 900);

      // Subtle movement in the atmospheric background.
      const wind = addNoise(0.012, 450, "lowpass");

      const lfo = ac.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.12;

      const lfoGain = ac.createGain();
      lfoGain.gain.value = 0.006;

      lfo.connect(lfoGain);
      lfoGain.connect(wind.g.gain);

      lfo.start();

      nodes.push(lfo, lfoGain);

      stops.push(() => {
        try {
          lfo.stop();
        } catch {}
      });

      break;
    }

    case "saturn": {
      // Saturn: ethereal golden tones and a deep, slowly shifting drone.
      addOsc("sine", 73.42, 0.12);
      addOsc("triangle", 110, 0.055, 5, 700);
      addOsc("sine", 146.83, 0.035, -3);
      addNoise(0.012, 500);

      // Slow modulation gives the atmosphere a drifting quality.
      const lfo = ac.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.06;

      const lfoGain = ac.createGain();
      lfoGain.gain.value = 4;

      lfo.connect(lfoGain);

      // Modulate the third oscillator's pitch very gently.
      const tone = nodes.find(
        (node) => node instanceof OscillatorNode && node.frequency.value === 146.83,
      ) as OscillatorNode | undefined;

      if (tone) {
        lfoGain.connect(tone.detune);
      }

      lfo.start();

      nodes.push(lfo, lfoGain);

      stops.push(() => {
        try {
          lfo.stop();
        } catch {}
      });

      break;
    }
  }

  return {
    gain,
    nodes,
    stop: () => stops.forEach((s) => s()),
  };
}
