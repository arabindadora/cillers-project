from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import logging
from confluent_kafka import Producer
import json
import uuid
from typing import Optional
from pydantic import BaseModel

from . import env, init, auth

logger = logging.getLogger(__name__)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_user(token: str = Depends(oauth2_scheme)) -> Optional[dict]:
    logger.info(f"TOKEN: {token}")
    if token:
        if user_data := auth.decode_jwt(token):
            return user_data
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid authentication credentials",
                        headers={"WWW-Authenticate": "Bearer"})
class PokemonInput(BaseModel):
    name: str
    image: str
    description: str

@app.on_event("startup")
async def startup_event():
    init.init()
    logger.info("Connecting to Kafka")
    app.state.producer = Producer({'bootstrap.servers': env.get_kafka_broker()})
    logger.info("Connected to Kafka")

@app.post("/input/add_pokemon")
async def add_pokemon(pokemon: PokemonInput, user: dict = Depends(get_user)):
    if not user:
        raise HTTPException(status_code=400, detail="User not authenticated")
    pokemon_data = {'id': str(uuid.uuid1()), 'name': pokemon.name, 'image': pokemon.image, 'description': pokemon.description }
    producer: Producer = app.state.producer
    producer.produce("pokemons", value=json.dumps(pokemon_data))
    producer.flush()
    return {"status": "success", "id": pokemon_data['id']}
