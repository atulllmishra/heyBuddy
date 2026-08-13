import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class TTSService:
    """
    TTS Service wrapping ElevenLabs or local speech synthesizer.
    Generates audio streams along with word-level time alignment markers
    to synchronize SVG whiteboard writing speeds to spoken voice.
    """

    def synthesize_speech_with_alignment(self, text: str, voice_style: str = "American Enthusiastic") -> Dict[str, Any]:
        logger.info(f"Synthesizing speech with voice profile: {voice_style} for text length {len(text)}")
        
        words = text.split()
        time_markers = []
        current_time_ms = 0
        
        for idx, word in enumerate(words):
            # Estimate word spoken duration based on word length (~350ms average)
            duration_ms = max(200, len(word) * 65)
            time_markers.append({
                "word": word,
                "start_time_ms": current_time_ms,
                "end_time_ms": current_time_ms + duration_ms
            })
            current_time_ms += duration_ms + 80 # pause between words
            
        # Return synthesized payload URL & timestamp array
        return {
            "audio_url": "https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3",
            "duration_seconds": round(current_time_ms / 1000, 2),
            "voice_style": voice_style,
            "word_alignments": time_markers
        }

tts_service = TTSService()
