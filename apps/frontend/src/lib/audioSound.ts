/**
 * Web Audio API Synthesizer
 * Generates an instant, crisp WhatsApp-style "ceting" chime and distinct error alert buzzer.
 * Zero external audio file download, zero latency, works 100% offline.
 */
export function playWhatsAppChime(volume: number = 0.3) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Tone 1: High crisp frequency (1046.5 Hz - C6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now);
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain1.gain.setValueAtTime(volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // Tone 2: Harmonious resonance ping (1567.98 Hz - G6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1567.98, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.14); // C7

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(volume * 0.8, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.33);
  } catch (err) {
    console.debug('Audio chime notification skipped:', err);
  }
}

/**
 * High-Attention Error Buzzer Alarm (Low Dual-Tone Buzz for POS Warnings & Errors)
 */
export function playErrorBuzzerSound(volume: number = 0.4) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Beep 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.linearRampToValueAtTime(240, now + 0.12);

    gain1.gain.setValueAtTime(volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Beep 2 (Second alarm pulse)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(280, now + 0.18);
    osc2.frequency.linearRampToValueAtTime(200, now + 0.32);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(volume, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.34);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.35);
  } catch (err) {
    console.debug('Error buzzer skipped:', err);
  }
}
