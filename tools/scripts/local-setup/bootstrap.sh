#! /bin/bash

pnpm i

source ./tools/scripts/local-setup/utils.sh

create_env

generate_mnemonic

create_rahat_volumes

start_dev_tools

get_ganache_accounts

migrate_seed

pnpm graph:codegen

contract_setup
graph_setup
