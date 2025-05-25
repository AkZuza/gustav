import os
from graphiti_core import Graphiti
import graphiti_core
from graphiti_core.llm_client.gemini_client import GeminiClient
from graphiti_core.llm_client.config import LLMConfig
from graphiti_core.embedder.gemini import GeminiEmbedder, GeminiEmbedderConfig
import asyncio
import json
from graphiti_core.utils.bulk_utils import RawEpisode
import logging
import os
from datetime import datetime, timezone
from logging import INFO
from dotenv import load_dotenv
from graphiti_core import Graphiti
import episodes
import entities

load_dotenv()

# Google API key configuration
api_key = os.environ.get("GOOGLE_API_KEY", None)
api_version = "2025-05-17"
endpoint = "https://graphiti-akzuza.openai.azure.com/"
if not api_key:
    raise ValueError("API_KEY environment variable must be set")

neo4jUri = os.environ.get("NEO4J_URI", "neo4j://localhost")
neo4jUserName = os.environ.get("NEO4J_USERNAME", "neo4j")
neo4jPassword = os.environ.get("NEO4J_PASSWORD", "password")

logging.basicConfig(
    level=INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)


# Create graphiti instance
graphiti = Graphiti(
    neo4jUri,
    neo4jUserName,
    neo4jPassword,
    llm_client=GeminiClient(
        config=LLMConfig(
            api_key=api_key,
            model="gemini-2.0-flash"
        )
    ),
    embedder=GeminiEmbedder(
        config=GeminiEmbedderConfig(
            api_key=api_key,
            embedding_model="embedding-001"
        )
    )
)

def print_options():
    print("1.Search")
    print("2.Operation")

async def main():
    await graphiti.build_indices_and_constraints()
    # Initial episode
    bulk = []
    for i, episode in enumerate(episodes.account_episodes):
        raw = RawEpisode(
            name=f'Episode {i}',
            content=episode['content'],
            source_description=episode['description'],
            source=episode['type'],
            reference_time=datetime.today()
        )
        bulk.append(raw)

    await graphiti.add_episode_bulk(bulk)

    while True:
        print_options()
        print("Enter choice: ", end='')
        choice = input()
        if choice == "1":
            print("Enter Query: ")
            query = input()
            results = await graphiti.search(query)
            print("\nResults")
            for result in results:
                print(f"Fact: {result.fact}")

if __name__ == "__main__":
    asyncio.run(main())
