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