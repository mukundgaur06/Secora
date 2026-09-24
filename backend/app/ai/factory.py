from app.ai.provider import LLMProvider
from app.ai.providers.google import GoogleGeminiProvider
from app.ai.providers.mock_provider import MockCybersecurityProvider
from app.config import settings

def get_llm_provider() -> LLMProvider:
    """
    Factory resolving the active LLM Provider based on environment configuration.
    """
    provider_type = settings.LLM_PROVIDER.lower().strip()

    if provider_type == "gemini" and settings.GEMINI_API_KEY:
        return GoogleGeminiProvider(api_key=settings.GEMINI_API_KEY, model=settings.DEFAULT_MODEL)

    if provider_type == "mock":
        return MockCybersecurityProvider()

    # Fallback to Google Gemini if key is available, else mock provider
    if settings.GEMINI_API_KEY:
        return GoogleGeminiProvider(api_key=settings.GEMINI_API_KEY, model=settings.DEFAULT_MODEL)

    return MockCybersecurityProvider()
