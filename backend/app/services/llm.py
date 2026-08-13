import json
import logging
from typing import Dict, Any, List
from app.models.schemas import PedagogyStyle

logger = logging.getLogger(__name__)

class LLMOrchestrationService:
    """
    LLM Service to compile pedagogical scripts (Feynman, Socratic, Analogical, Deep Dive)
    along with timed whiteboard drawing commands and LaTeX formulas for SVG writing animation.
    """

    PEDAGOGY_PROMPTS = {
        PedagogyStyle.FEYNMAN: (
            "Explain the concept using extreme clarity, simple relatable language, child-friendly analogies, "
            "and eliminate jargon. Focus on intuitive whiteboard drawings and step-by-step visualizations."
        ),
        PedagogyStyle.SOCRATIC: (
            "Guide the student using guided Socratic questioning. Ask thought-provoking questions, "
            "pause for reflection, write down intermediate questions on the whiteboard, and lead them to discovering the formula."
        ),
        PedagogyStyle.ANALOGICAL: (
            "Use vivid narrative storytelling and real-world analogies (e.g. water flow for current, galaxy motion for gravitation). "
            "Illustrate each analogy with clear whiteboard diagrams and formulas."
        ),
        PedagogyStyle.DEEP_DIVE: (
            "Provide rigorous academic proofs, formal mathematical notation, edge cases, boundary conditions, "
            "and competitive exam level problem-solving tricks."
        )
    }

    def generate_lecture_manifest(
        self, 
        concept_query: str, 
        pedagogy_style: Any, 
        target_language: str = "English"
    ) -> Dict[str, Any]:
        pedagogy_str = pedagogy_style.value if hasattr(pedagogy_style, 'value') else str(pedagogy_style)
        logger.info(f"Generating script manifest for '{concept_query}' using {pedagogy_str} in {target_language}")
        
        prompt_instruction = self.PEDAGOGY_PROMPTS.get(pedagogy_style, self.PEDAGOGY_PROMPTS[PedagogyStyle.FEYNMAN])

        # Generate timed slides & whiteboard handwriting strokes manifest
        slides = self._build_timed_slides(concept_query, pedagogy_str)
        whiteboard_vectors = self._build_whiteboard_vectors(slides)

        full_script = f"Welcome to this detailed lecture on {concept_query}. Today we adopt the {pedagogy_str} methodology. {prompt_instruction} Let's look at the whiteboard..."

        return {
            "title": f"Mastering {concept_query}",
            "pedagogy_style": pedagogy_str,
            "target_language": target_language,
            "full_audio_script": full_script,
            "slides": slides,
            "whiteboard_vectors": whiteboard_vectors,
            "total_estimated_duration_seconds": len(slides) * 45
        }

    def _build_timed_slides(self, concept_query: str, pedagogy_str: str) -> List[Dict[str, Any]]:
        return [
            {
                "slide_number": 1,
                "timestamp_start_ms": 0,
                "timestamp_end_ms": 15000,
                "title": f"1. Core Intuition of {concept_query}",
                "bullet_points": [
                    f"Understanding the core physical/mathematical foundation of {concept_query}",
                    "Connecting prior knowledge with new dynamic models",
                    "Why this equation governs real-world behavior"
                ],
                "formula_latex": "E = h \\cdot \\nu = \\frac{h c}{\\lambda}",
                "whiteboard_text": f"Intuition: {concept_query} is driven by quantum energy exchange."
            },
            {
                "slide_number": 2,
                "timestamp_start_ms": 15000,
                "timestamp_end_ms": 35000,
                "title": "2. Step-by-Step Whiteboard Derivation",
                "bullet_points": [
                    "Isolating independent variables",
                    "Applying differential boundary conditions",
                    "Cancelling redundant terms to yield the final standard form"
                ],
                "formula_latex": "\\nabla^2 \\Psi + \\frac{2m}{\\hbar^2} (E - V) \\Psi = 0",
                "whiteboard_text": "Derivation Step: Substitute potential field V into Schrödinger Equation."
            },
            {
                "slide_number": 3,
                "timestamp_start_ms": 35000,
                "timestamp_end_ms": 60000,
                "title": "3. Solved Competitive Exam Problem & Strategy",
                "bullet_points": [
                    "Identifying trick parameters in exam questions",
                    "Applying shortcut formula for fast computation",
                    "Checking dimensional consistency & edge cases"
                ],
                "formula_latex": "T_{half} = \\frac{\\ln(2)}{\\lambda} \\approx \\frac{0.693}{\\lambda}",
                "whiteboard_text": "Shortcut: Never integrate manually when exponent decay factor is constant!"
            }
        ]

    def _build_whiteboard_vectors(self, slides: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        vectors = []
        for slide in slides:
            text = slide["whiteboard_text"]
            formula = slide["formula_latex"]
            start_ms = slide["timestamp_start_ms"]
            
            vectors.append({
                "id": f"slide_{slide['slide_number']}_title",
                "timestamp_ms": start_ms + 1000,
                "duration_ms": 3000,
                "type": "heading",
                "text": slide["title"],
                "is_formula": False,
                "x": 60,
                "y": 80,
                "svg_path": f"M 60 80 L {60 + len(slide['title']) * 12} 80"
            })

            vectors.append({
                "id": f"slide_{slide['slide_number']}_formula",
                "timestamp_ms": start_ms + 5000,
                "duration_ms": 5000,
                "type": "formula",
                "text": formula,
                "is_formula": True,
                "x": 100,
                "y": 180,
                "svg_path": f"M 100 180 C 150 160, 250 200, 350 180 S 450 160, 550 180"
            })

            vectors.append({
                "id": f"slide_{slide['slide_number']}_text",
                "timestamp_ms": start_ms + 11000,
                "duration_ms": 4000,
                "type": "text",
                "text": text,
                "is_formula": False,
                "x": 60,
                "y": 280,
                "svg_path": f"M 60 280 L {60 + len(text) * 8} 280"
            })

        return vectors

llm_service = LLMOrchestrationService()
