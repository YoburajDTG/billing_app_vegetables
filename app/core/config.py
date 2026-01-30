from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_DRIVER: str = "postgresql+psycopg2"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "test"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "post123"
    SECRET_KEY: str 

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
