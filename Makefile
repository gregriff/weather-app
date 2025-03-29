# these are for development only. refer to readme for installation instructions

# use this after adding or updating packages in package.json
lock:
	npm install

# install from package-lock.json
install:
	npm ci

run:
	npm run dev

lint:
	npm run lint

format: lint
	npm run format


.PHONY: install format lock run lint
