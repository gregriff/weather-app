# these are for development only. refer to readme for installation instructions

# use this after adding new packages to pyproject.toml
lock:
	npm install

# install all project and dev dependencies in a development venv
install:
	npm ci

run:
	npm run dev

lint:
	npm run lint

format: lint
	npm run format


.PHONY: install format lock run lint format
