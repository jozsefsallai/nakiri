# NakiriAPI workers

The NakiriAPI workers are designed for periodically running jobs to check
whether monitored keywords have any new entries on YouTube (that have not been
scanned previously).

## Requirements

- Go
- NakiriAPI with MySQL

## Setup

**Ensure the `.env` file is properly configured in NakiriAPI**. The worker pool
service will try to load the dotenv from a path relative to its executable, one
level higher, then another level higher (in that order). You can manually
specify the path to the dotenv file using the `DOTENV_PATH` environment variable

```
DOTENV_PATH=../.env ./workers
```

**Ensure the database is properly set up.**

**Build the app:**

```
go build .
```

**Then run it:**

```
./workers
```

For development purposes, you can also use `go run`:

```
DOTENV_PATH=../.env go run main.go
```

## License

The source code of this app is licensed under MIT. Refer to the LICENSE file for
more details.
