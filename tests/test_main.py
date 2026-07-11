from skillnova.main import greet


def test_greet_default() -> None:
    assert greet() == "Hello, World! Welcome to Skillnova."


def test_greet_name() -> None:
    assert greet("Skillnova") == "Hello, Skillnova! Welcome to Skillnova."
