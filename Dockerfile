FROM rust:1.45 as server-builder

RUN USER=root cargo new --bin zakar_server 
WORKDIR /zakar_server
COPY ./zakar_server/Cargo.toml ./Cargo.toml
COPY ./zakar_server/Cargo.lock ./Cargo.lock
RUN cargo build --release
RUN rm src/*.rs

COPY ./zakar_server ./

RUN rm ./target/release/deps/zakar_server*
RUN cargo build --release



FROM node as client-builder 
WORKDIR /app
COPY ./zakar-client/package.json ./
COPY ./zakar-client/yarn.lock ./
RUN yarn
COPY ./zakar-client ./
RUN yarn build



FROM debian:buster-slim
ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get -y install postgresql \
    && apt-get install -y ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP} \
    && mkdir -p /usr/src/zakar-client/build

COPY --from=client-builder /app/build /usr/src/zakar-client/build/
COPY --from=server-builder /zakar_server/target/release/zakar_server ${APP}/zakar_server

RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

CMD ["./zakar_server"]
