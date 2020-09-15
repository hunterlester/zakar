### Development

- `git clone https://github.com/hunterlester/zakar.git`
- `cd zakar`

#### Client

- `cd zakar-client`
- `yarn`
- `yarn start`

##### Build
- `yarn build`

#### Server

- `cd zakar-client`
- `systemfd --no-pid -s http::8000 -- cargo watch -x run`

##### Build
- `cargo run --release`

##### Docker build
- Right-click on `Dockerfile` and choose `Build image...`

##### Docker test
- `docker run -p 8000:8000 --env-file path/to/.env file zakar:latest`
- `docker run -it --entrypoint bash zakar:latest` to open terminal in container

### Deployment

#### Staging
- heroku container:push web --remote staging
- heroku container:release web --remote staging

#### Production
- heroku container:push web
- heroku container:release web
