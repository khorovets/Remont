#!/usr/bin/env bash
# ============================================================================
# Auto-Approve Agent — автоматический апрув задач в колонке review
# ============================================================================
# Использование:
#   ./scripts/auto-approve.sh               # Бесконечный цикл (sleep 10)
#   ./scripts/auto-approve.sh --once        # Однократный запуск
#   ./scripts/auto-approve.sh --help        # Справка
#
# Описание:
#   1. Получает список задач в колонке review через kanban task list --column review
#   2. Для каждой задачи вызывает kanban task done --task-id <id>
#   3. Логирует результат
#   4. В режиме цикла — повторяет проверку каждые 10 секунд
# ============================================================================

set -euo pipefail

MODE="${1:-loop}"  # loop | once
SLEEP_INTERVAL="${SLEEP_INTERVAL:-10}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $(date '+%H:%M:%S') $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $(date '+%H:%M:%S') $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $(date '+%H:%M:%S') $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') $*"; }

# ------------------------------------------------------------------
# Справка
# ------------------------------------------------------------------
if [[ "${MODE}" == "--help" ]] || [[ "${MODE}" == "-h" ]]; then
  echo "Auto-Approve Agent — автоматический апрув задач в колонке review"
  echo ""
  echo "Usage: $0 [--once] [--help]"
  echo "  (без флагов)    Бесконечный цикл с проверкой каждые ${SLEEP_INTERVAL} сек"
  echo "  --once          Однократный запуск"
  echo "  --help, -h      Эта справка"
  echo ""
  echo "Env vars:"
  echo "  SLEEP_INTERVAL  Интервал между проверками в секундах (по умолчанию: 10)"
  exit 0
fi

ONESHOT=false
if [[ "${MODE}" == "--once" ]]; then
  ONESHOT=true
fi

# ------------------------------------------------------------------
# Проверка наличия Kanban CLI
# ------------------------------------------------------------------
if ! command -v task &>/dev/null; then
  log_error "Kanban CLI (task) не найден в PATH"
  log_error "Установите Kanban CLI: npm install -g <kanban-cli-package>"
  exit 1
fi

# ------------------------------------------------------------------
# Основная логика одного прохода
# ------------------------------------------------------------------
do_pass() {
  log_info "Запрашиваю задачи в колонке review..."

  TASK_IDS=$(task list --column review 2>/dev/null || echo "")

  if [[ -z "${TASK_IDS}" ]]; then
    log_info "Нет задач в колонке review"
    return 0
  fi

  # task list --column review выводит ID задач (по одному на строку или через пробел)
  # Парсим вывод — ожидаем строки с ID задач
  local count=0
  while IFS= read -r line; do
    # Пропускаем пустые строки и заголовки
    [[ -z "${line}" ]] && continue
    # Извлекаем ID задачи (первое слово строки)
    TASK_ID=$(echo "${line}" | awk '{print $1}')
    if [[ -z "${TASK_ID}" ]]; then
      continue
    fi

    log_info "Апрувлю задачу #${TASK_ID}..."
    if task done --task-id "${TASK_ID}" 2>&1; then
      log_ok "Задача #${TASK_ID} отмечена как выполненная"
      ((count++)) || true
    else
      log_warn "Не удалось апрувнуть задачу #${TASK_ID}"
    fi
  done <<< "${TASK_IDS}"

  if [[ ${count} -gt 0 ]]; then
    log_ok "Апрувнуто задач: ${count}"
  fi
}

# ------------------------------------------------------------------
# Главный цикл
# ------------------------------------------------------------------
log_info "=============================================="
log_info "Auto-Approve Agent — запуск"
log_info "Режим: $([ "${ONESHOT}" = true ] && echo 'однократный' || echo 'цикл каждые '${SLEEP_INTERVAL}' сек')"
log_info "=============================================="

if [[ "${ONESHOT}" == "true" ]]; then
  do_pass
  log_info "Однократный проход завершён."
  exit 0
fi

# Бесконечный цикл
while true; do
  do_pass
  sleep "${SLEEP_INTERVAL}"
done
