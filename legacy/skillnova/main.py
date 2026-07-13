"""Main module for Skillnova."""


def greet(name: str = "World") -> str:
    """Return a greeting message."""
    return f"Hello, {name}! Welcome to Skillnova."


def main() -> None:
    """Entry point for the package."""
    print(greet())


if __name__ == "__main__":
    main()
