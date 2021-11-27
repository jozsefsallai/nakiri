FROM golang:1.16-alpine

WORKDIR /workers

COPY workers/go.mod ./
COPY workers/go.sum ./

RUN go mod download

COPY workers/ ./
COPY .env ./

RUN go build -o /nakiriworkers

ENV DOTENV_PATH /workers/.env

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

CMD /wait && /nakiriworkers
