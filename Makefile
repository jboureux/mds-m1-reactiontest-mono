temp-sh:
	docker run --rm -ti -v ./:/app -w /app node:alpine /bin/sh 

api-sh:
	docker compose exec api /bin/sh