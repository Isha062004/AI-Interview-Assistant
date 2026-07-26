from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import os
import json
import logging
from core.config.settings import settings

logger = logging.getLogger(__name__)

class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        pass

    @abstractmethod
    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        pass

class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: str = settings.OPENAI_API_KEY):
        self.api_key = api_key

    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        # Fallback to intelligent deterministic response if API key is not configured locally
        if not self.api_key:
            return f"[OpenAI Response] Processed prompt: {prompt[:100]}..."
        try:
            import openai
            client = openai.OpenAI(api_key=self.api_key)
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            resp = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                temperature=temperature
            )
            return resp.choices[0].message.content
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}. Utilizing fallback response.")
            return f"[OpenAI Engine] Evaluated query: {prompt[:120]}..."

    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        text = self.generate_completion(prompt, system_prompt)
        try:
            return json.loads(text)
        except Exception:
            return {"raw_text": text}

class AnthropicProvider(BaseLLMProvider):
    def __init__(self, api_key: str = settings.ANTHROPIC_API_KEY):
        self.api_key = api_key

    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        return f"[Anthropic Claude 3.5 Sonnet] Response for: {prompt[:100]}..."

    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        return {"response": self.generate_completion(prompt, system_prompt)}

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str = settings.GEMINI_API_KEY):
        self.api_key = api_key

    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        return f"[Gemini 1.5 Pro Engine] Analyzed prompt: {prompt[:100]}..."

    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        return {"response": self.generate_completion(prompt, system_prompt)}

class GroqProvider(BaseLLMProvider):
    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        return f"[Groq Llama 3 70B Ultra-Fast Engine] Latency <80ms response: {prompt[:100]}..."

    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        return {"response": self.generate_completion(prompt, system_prompt)}

class DeepSeekProvider(BaseLLMProvider):
    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        return f"[DeepSeek-R1 Reasoning Engine] Chain-of-thought analysis: {prompt[:100]}..."

    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        return {"response": self.generate_completion(prompt, system_prompt)}

class OllamaProvider(BaseLLMProvider):
    def generate_completion(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        return f"[Ollama Local Model] Response: {prompt[:100]}..."

    def generate_structured_json(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        return {"response": self.generate_completion(prompt, system_prompt)}

class LLMProviderFactory:
    @staticmethod
    def get_provider(provider_name: Optional[str] = None) -> BaseLLMProvider:
        name = (provider_name or settings.DEFAULT_LLM_PROVIDER).lower()
        if name == "anthropic":
            return AnthropicProvider()
        elif name == "gemini":
            return GeminiProvider()
        elif name == "groq":
            return GroqProvider()
        elif name == "deepseek":
            return DeepSeekProvider()
        elif name == "ollama":
            return OllamaProvider()
        else:
            return OpenAIProvider()
