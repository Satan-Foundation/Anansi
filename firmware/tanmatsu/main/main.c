#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_system.h"
#include "driver/gpio.h"
#include "pax_gfx.h"
#include "pax_fonts.h"

#define SCREEN_WIDTH 800
#define SCREEN_HEIGHT 480
#define HEADER_HEIGHT 54
#define NAV_HEIGHT 58
#define PANEL_X 28
#define PANEL_Y 78
#define PANEL_W 744
#define PANEL_H 310

static const char *TAG = "aegis";
static pax_buf_t framebuffer;
static uint8_t framebuffer_storage[SCREEN_WIDTH * SCREEN_HEIGHT * 2] __attribute__((aligned(4)));

typedef enum {
    SCREEN_HOME,
    SCREEN_IDENTITY,
    SCREEN_CREDENTIALS,
    SCREEN_WALLET,
    SCREEN_MESH,
    SCREEN_FIELD,
    SCREEN_VERIFY,
} aegis_screen_t;

typedef struct {
    aegis_screen_t screen;
    uint8_t selected;
    uint8_t trust;
    bool simulation;
} aegis_state_t;

static aegis_state_t state = {
    .screen = SCREEN_HOME,
    .selected = 0,
    .trust = 94,
    .simulation = true,
};

static void fill(uint16_t color) { pax_background(&framebuffer, color); }
static void text(const char *value, int x, int y, int size, uint16_t color) {
    pax_draw_text(&framebuffer, &pax_font_saira_regular, (float) size, (float) x, (float) y, color, value);
}
static void rect(int x, int y, int w, int h, uint16_t color) {
    pax_draw_rect(&framebuffer, color, (float) x, (float) y, (float) w, (float) h);
}
static void outline(int x, int y, int w, int h, uint16_t color) {
    pax_draw_line(&framebuffer, color, x, y, x + w, y);
    pax_draw_line(&framebuffer, color, x + w, y, x + w, y + h);
    pax_draw_line(&framebuffer, color, x + w, y + h, x, y + h);
    pax_draw_line(&framebuffer, color, x, y + h, x, y);
}

static void draw_header(const char *title) {
    rect(0, 0, SCREEN_WIDTH, HEADER_HEIGHT, 0x102033);
    text("AEGIS", 28, 16, 22, 0xD7F7FF);
    text(title, 148, 19, 14, 0x8BA8B7);
    text(state.simulation ? "SIMULATION" : "LIVE", 626, 19, 12, 0xF6C76B);
    rect(746, 19, 10, 10, 0x4ADE80);
    text("ONLINE", 764, 19, 12, 0x8BA8B7);
}

static void draw_nav(void) {
    rect(0, SCREEN_HEIGHT - NAV_HEIGHT, SCREEN_WIDTH, NAV_HEIGHT, 0x0D1723);
    const char *labels[] = {"HOME", "PASS", "MESH", "FIELD", "VERIFY"};
    const int xs[] = {48, 196, 348, 504, 672};
    for (int i = 0; i < 5; i++) {
        uint16_t color = (state.screen == i || (i == 1 && state.screen == SCREEN_IDENTITY) || (i == 4 && state.screen == SCREEN_CREDENTIALS)) ? 0x6EE7F2 : 0x71889A;
        text(labels[i], xs[i], SCREEN_HEIGHT - 34, 12, color);
    }
}

static void draw_home(void) {
    draw_header("FIELD IDENTITY CONSOLE");
    text("Good evening, operator.", PANEL_X, 88, 28, 0xE6F7FA);
    text("Your device is ready for field work.", PANEL_X, 120, 14, 0x8099A8);
    rect(PANEL_X, 164, 360, 128, 0x142738);
    text("DEVICE TRUST", PANEL_X + 20, 184, 12, 0x84A1B1);
    text("94", PANEL_X + 20, 208, 46, 0x6EE7F2);
    text("/ 100", PANEL_X + 86, 232, 14, 0x829BA8);
    rect(PANEL_X + 20, 270, 310, 6, 0x253B4B);
    rect(PANEL_X + 20, 270, 292, 6, 0x6EE7F2);
    rect(420, 164, 352, 128, 0x142738);
    text("MESH STATUS", 440, 184, 12, 0x84A1B1);
    text("12", 440, 208, 38, 0xE6F7FA);
    text("peers connected", 490, 229, 14, 0x829BA8);
    text("LAST SYNC  2 min ago", 440, 261, 12, 0x6EE7F2);
    text("A", PANEL_X, 342, 16, 0x6EE7F2);
    text("Press ENTER to open identity passport", PANEL_X + 28, 342, 14, 0xB4CAD2);
    draw_nav();
}

static void draw_list(const char *title, const char *subtitle, const char *items[], int count) {
    draw_header(title);
    text(subtitle, PANEL_X, 88, 14, 0x8099A8);
    for (int i = 0; i < count; i++) {
        int y = 124 + i * 56;
        uint16_t bg = (i == state.selected) ? 0x1A3948 : 0x142738;
        rect(PANEL_X, y, PANEL_W, 42, bg);
        text(items[i], PANEL_X + 18, y + 13, 15, i == state.selected ? 0xE6F7FA : 0xB4CAD2);
        text(i == state.selected ? "ENTER" : "", PANEL_X + 650, y + 13, 11, 0x6EE7F2);
    }
    draw_nav();
}

static void draw_screen(void) {
    fill(0x08121C);
    switch (state.screen) {
        case SCREEN_HOME: draw_home(); break;
        case SCREEN_IDENTITY: {
            const char *items[] = {"IDENTITY PASSPORT", "CREDENTIALS", "WALLET / BALANCE"};
            draw_list("IDENTITY", "Device-bound identity and credentials", items, 3);
            break;
        }
        case SCREEN_CREDENTIALS: {
            const char *items[] = {"FIELD OPERATOR / VERIFIED", "MEDICAL RESPONDER / ACTIVE", "ACCESS LEVEL 03 / VALID"};
            draw_list("CREDENTIALS", "Signed credentials available offline", items, 3);
            break;
        }
        case SCREEN_WALLET: {
            const char *items[] = {"FIELD CREDIT", "RELAY TOKENS", "RECENT ACTIVITY"};
            draw_list("WALLET", "Local demo wallet", items, 3);
            break;
        }
        case SCREEN_MESH: {
            const char *items[] = {"12 PEERS / HEALTHY", "NORTH RELAY / 86%", "SOUTH RELAY / 72%", "SYNC NOW"};
            draw_list("MESH", "Encrypted peer network overview", items, 4);
            break;
        }
        case SCREEN_FIELD: {
            const char *items[] = {"REPORT 042 / MEDICAL", "REPORT 041 / SUPPLY", "REPORT 039 / ROUTE", "CREATE FIELD REPORT"};
            draw_list("FIELD REPORTS", "Offline-first incident records", items, 4);
            break;
        }
        case SCREEN_VERIFY: {
            const char *items[] = {"SCAN CREDENTIAL", "VERIFY SIGNATURE", "VIEW TRUST PATH", "CLEAR SESSION"};
            draw_list("VERIFICATION", "Local verification console", items, 4);
            break;
        }
    }
}

static void handle_input(void) {
    // Template projects map the Tanmatsu keyboard into this small event layer.
    // The demo keeps a conservative GPIO fallback for bring-up: GPIO 0 = select,
    // GPIO 1 = back. Replace with the template's pax_input queue on hardware.
    if (gpio_get_level(GPIO_NUM_0) == 0) {
        state.screen = (state.screen == SCREEN_HOME) ? SCREEN_IDENTITY : state.screen;
        state.selected = 0;
        vTaskDelay(pdMS_TO_TICKS(180));
    }
    if (gpio_get_level(GPIO_NUM_1) == 0) {
        state.screen = SCREEN_HOME;
        state.selected = 0;
        vTaskDelay(pdMS_TO_TICKS(180));
    }
}

void app_main(void) {
    ESP_LOGI(TAG, "Starting AEGIS Tanmatsu firmware demo");
    ESP_LOGW(TAG, "SIMULATION mode: identity, mesh, and verification are not cryptographic");
    pax_buf_init(&framebuffer, framebuffer_storage, SCREEN_WIDTH, SCREEN_HEIGHT, PAX_BUF_16_565);
    gpio_set_direction(GPIO_NUM_0, GPIO_MODE_INPUT);
    gpio_set_direction(GPIO_NUM_1, GPIO_MODE_INPUT);
    draw_screen();
    while (true) {
        handle_input();
        draw_screen();
        vTaskDelay(pdMS_TO_TICKS(33));
    }
}
