FROM rust:1.45 as server-builder

RUN USER=root cargo new --bin zakar_server 
WORKDIR /zakar_server
COPY ./zakar_server/Cargo.toml ./Cargo.toml
COPY ./zakar_server/Cargo.lock ./Cargo.lock
COPY ./zakar_server/diesel.toml ./diesel.toml
COPY ./zakar_server/migrations ./migrations
RUN cargo install diesel_cli --no-default-features --features postgres
RUN mkdir -p /out && cp /usr/local/cargo/bin/diesel /out/
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
    && apt-get -y install libpq-dev \
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
COPY --from=server-builder /zakar_server/diesel.toml ${APP}/
COPY --from=server-builder /zakar_server/Cargo.toml ${APP}/
COPY --from=server-builder /zakar_server/Cargo.lock ${APP}/
COPY --from=server-builder /zakar_server/migrations ${APP}/migrations/
COPY --from=server-builder /out/diesel /bin/
COPY ./deployment-tasks.sh ${APP}/
COPY ./Dockerfile ${APP}/

RUN chown -R $APP_USER:$APP_USER ${APP}

WORKDIR ${APP}
RUN chmod +x ./deployment-tasks.sh 
USER $APP_USER

CMD ["./deployment-tasks.sh"]
