import uuid
import strawberry
from . import couchbase as cb, env


@strawberry.type
class Product:
    id: str
    name: str
    image: str
    description: str


@strawberry.type
class Pokemon:
    id: str
    name: str
    image: str
    description: str


def create_product(name: str, image: str, description: str) -> Product:
    id = str(uuid.uuid1())
    cb.insert(
        env.get_couchbase_conf(),
        cb.DocSpec(
            bucket=env.get_couchbase_bucket(),
            collection="products",
            key=id,
            data={"name": name, "image": image, "description": description},
        ),
    )
    return Product(id=id, name=name, image=image, description=description)


def create_pokemon(name: str, image: str, description: str) -> Pokemon:
    id = str(uuid.uuid1())
    cb.insert(
        env.get_couchbase_conf(),
        cb.DocSpec(
            bucket=env.get_couchbase_bucket(),
            collection="products",
            key=id,
            data={"name": name},
        ),
    )
    return Pokemon(id=id, name=name, image=image, description=description)


def get_product(id: str) -> Product | None:
    if doc := cb.get(
        env.get_couchbase_conf(),
        cb.DocRef(bucket=env.get_couchbase_bucket(), collection="products", key=id),
    ):
        return Product(
            id=id, name=doc["name"], image=doc["image"], description=doc["description"]
        )


def get_pokemon(id: str) -> Pokemon | None:
    if doc := cb.get(
        env.get_couchbase_conf(),
        cb.DocRef(bucket=env.get_couchbase_bucket(), collection="pokemons", key=id),
    ):
        return Pokemon(id=id, name=doc["name"])


def delete_product(id: str) -> None:
    cb.remove(
        env.get_couchbase_conf(),
        cb.DocRef(bucket=env.get_couchbase_bucket(), collection="products", key=id),
    )


def delete_pokemon(id: str) -> None:
    cb.remove(
        env.get_couchbase_conf(),
        cb.DocRef(bucket=env.get_couchbase_bucket(), collection="products", key=id),
    )


def list_products() -> list[Product]:
    result = cb.exec(
        env.get_couchbase_conf(),
        f"SELECT name, META().id, image, description FROM {env.get_couchbase_bucket()}._default.products",
    )
    return [
        Product(
            id=r["id"], name=r["name"], image=r["image"], description=r["description"]
        )
        for r in result
    ]


def list_pokemons() -> list[Pokemon]:
    result = cb.exec(
        env.get_couchbase_conf(),
        f"SELECT name, META().id, image, description FROM {env.get_couchbase_bucket()}._default.products",
    )
    return [
        Pokemon(
            id=r["id"], name=r["name"], image=r["image"], description=r["description"]
        )
        for r in result
    ]
