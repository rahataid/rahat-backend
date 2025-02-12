current_dir="$PWD"

create_env() {
    # dev tools directory
    declare -a projectDirs=(
        "$current_dir" #for root project as well
        "$current_dir/tools/docker-compose/dev-tools"
    )

    for project in "${projectDirs[@]}"; do
        env_file="$project/.env"
        example_content=$(<"$project/.env.example")
        echo "$example_content" >"$env_file"
    done
}

generate_mnemonic() {
    pnpm generate:mnemonic $current_dir
}

get_ganache_accounts() {
    docker cp ganache-rahat:/db/accounts ./accounts.json

}

migrate_seed() {
    pnpm migrate:dev
    pnpm seed:eldevsettings $current_dir
    pnpm seed:c2cdevsettings $current_dir
    pnpm seed:aadevsettings $current_dir
    pnpm seed:cvadevsettings $current_dir
    pnpm seed:rpdevsettings $current_dir
    pnpm seed:kenyadevsettings $current_dir
    pnpm seed:cambodiadevsettings $current_dir
    pnpm seed:chainsettings
    npx ts-node prisma/seed.communication-settings.ts
}

create_rahat_volumes() {
    docker volume create rahat_pg_data &&
        docker volume create rahat_pg_admin_data &&
        docker volume create rahat_ganache_data &&
        docker volume create rahat_redis_data &&
        docker volume create rahat_pg_graph_data &&
        docker volume create rahat_ipfs_data
}

start_dev_tools() {
    docker network create rahat_platform
    docker network create rahat_projects
    declare -a composeDirs=(
        "$current_dir/tools/docker-compose/dev-tools"
        "$current_dir/tools/docker-compose/graph"
    )

    for project in "${composeDirs[@]}"; do
        compose_file="$project/docker-compose.yml"
        docker compose -f $compose_file up -d
    done

    echo "Waiting for dev tools to start..."
    sleep 10
}

stop_dev_tools() {
    declare -a composeDirs=(
        "$current_dir/tools/docker-compose/dev-tools"
        "$current_dir/tools/docker-compose/graph"
    )

    for project in "${composeDirs[@]}"; do
        compose_file="$project/docker-compose.yml"
        docker compose -f $compose_file down
    done
}

remove_rahat_volumes() {
    docker volume rm rahat_pg_data &&
        docker volume rm rahat_pg_admin_data &&
        docker volume rm rahat_ganache_data &&
        docker volume rm rahat_redis_data &&
        docker volume rm rahat_pg_graph_data &&
        docker volume rm rahat_ipfs_data
}

rm_modules() {
    rm -rf dist node_modules tmp
}

contract_setup(){
    pnpm seed:contracts
    pnpm seed:network $current_dir
}

graph_setup() {
    pnpm graph:codegen
    pnpm graph:create-local
    graph_url=$(pnpm graph:deploy-local | grep -o 'http://[^ ]*' | tail -1)
    export graph_url
}

reset() {
    stop_dev_tools
    remove_rahat_volumes
    rm_modules
}
