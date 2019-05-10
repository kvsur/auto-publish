#!/bin/bash

# 失败输出内容
error() {
    echo '\033[31m $1 \033[0m'
}

# 成功输出内容
success() {
    echo '\033[32m $1 \033[0m'
}

# 警告输出内容
warning() {
    echo '\033[33m $1 \033[0m'
}