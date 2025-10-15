<?php
/**
 * Plugin Name:       WooCommerce Dynamic Total
 * Plugin URI:        https://odaa.studio/
 * Description:       Создает кастомный интерфейс для вариативных товаров.
 * Version:           1.5.0
 * Author:            odaa.studio
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// 1. Подключаем стили и скрипты
function wdt_enqueue_assets() {
    if ( is_product() ) {
        wp_enqueue_style('wdt-styler', plugin_dir_url( __FILE__ ) . 'css/style.css', array(), '1.5.0');
        
        // Подключаем ОБА скрипта
        wp_enqueue_script('wdt-calculator-script', plugin_dir_url( __FILE__ ) . 'js/calculator-script.js', array( 'jquery' ), '1.5.0', true);
        wp_enqueue_script('wdt-variation-styler', plugin_dir_url( __FILE__ ) . 'js/variation-styler.js', array( 'jquery' ), '1.5.0', true);
    }
    // Подключаем скрипты и для архивов для работы шорткода
    if ( is_shop() || is_product_category() || is_product_tag() ) {
        wp_enqueue_script('wdt-shortcode-helper', plugin_dir_url( __FILE__ ) . 'js/scripts.js', array( 'jquery' ), '1.5.0', true);
    }
}
add_action( 'wp_enqueue_scripts', 'wdt_enqueue_assets' );

// 2. Добавляем HTML-контейнер для блока "Итого"
function wdt_add_total_container_html() {
    if ( is_product() ) {
        echo '<div id="dynamic-total-price-container" style="margin-bottom: 20px; text-align: right; min-height: 2.5em;"></div>';
    }
}
add_action( 'woocommerce_before_add_to_cart_button', 'wdt_add_total_container_html' );

// 3. Шорткоды для вывода цен
function wdt_get_variation_price_by_slug( $product, $variation_slug ) {
    if ( ! $product || ! $product->is_type('variable') ) return '';
    $variations = $product->get_available_variations();
    foreach ( $variations as $variation ) {
        if ( isset( $variation['attributes']['attribute_pa_sposob-pokupki'] ) ) {
            $decoded_slug = urldecode( $variation['attributes']['attribute_pa_sposob-pokupki'] );
            if ( $decoded_slug === $variation_slug ) {
                return $variation['price_html'];
            }
        }
    }
    return '';
}
function wdt_show_meter_price_shortcode() {
    global $product; return wdt_get_variation_price_by_slug( $product, 'погонный-метр' );
}
add_shortcode('цена_метра', 'wdt_show_meter_price_shortcode');
function wdt_show_roll_price_shortcode() {
    global $product; return wdt_get_variation_price_by_slug( $product, 'рулон' );
}
add_shortcode('цена_рулона', 'wdt_show_roll_price_shortcode');
function wdt_display_smart_price_shortcode() {
    $product = wc_get_product( get_the_ID() );
    if ( ! $product ) return '';
    if ( $product->is_type('variable') ) {
        $meter_price_html = wdt_get_variation_price_by_slug( $product, 'погонный-метр' );
        if ( ! empty( $meter_price_html ) ) { return 'от ' . $meter_price_html; } 
        else { return $product->get_price_html(); }
    } else {
        return $product->get_price_html();
    }
}
add_shortcode('display_smart_price', 'wdt_display_smart_price_shortcode');