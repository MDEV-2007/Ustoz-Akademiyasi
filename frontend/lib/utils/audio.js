/**
 * Web Speech API and Web Audio synthesizer fallback for Arabic letter & phrase pronunciation.
 */
export function playArabicAudio(
  arabicText,
  fallbackFreq = 340,
  labelUz = '',
  onStatusChange = () => {}
) {
  if (typeof window === 'undefined') return;

  const triggerWebAudioFallback = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        onStatusChange('error', 'Audio brauzeringizda qo‘llab-quvvatlanmaydi.');
        return;
      }
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fallbackFreq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);

      onStatusChange('fallback', `«${arabicText}» (${labelUz}) audio tovushi yangradi.`);
      setTimeout(() => onStatusChange('idle', ''), 1200);
    } catch {
      onStatusChange('error', 'Audio ijro etishda xatolik.');
    }
  };

  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(arabicText);
      utter.lang = 'ar-SA';

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
      );

      utter.pitch = 1.05;
      utter.rate = 0.82;
      if (arabicVoice) {
        utter.voice = arabicVoice;
      }

      let started = false;
      utter.onstart = () => {
        started = true;
        onStatusChange('playing', `«${arabicText}» (${labelUz}) talaffuz qilinmoqda...`);
      };
      utter.onend = () => {
        onStatusChange('idle', `«${arabicText}» talaffuzi yakunlandi.`);
      };
      utter.onerror = () => {
        if (!started) triggerWebAudioFallback();
      };

      window.speechSynthesis.speak(utter);

      setTimeout(() => {
        if (!started && !window.speechSynthesis.speaking) {
          triggerWebAudioFallback();
        }
      }, 450);
    } else {
      triggerWebAudioFallback();
    }
  } catch {
    triggerWebAudioFallback();
  }
}
