<?php

class FrontendTest extends WP_UnitTestCase {

	public function testHasBlockControls() {
		$test_attribute_sets = [
			[
				'attrs' => [],
			],
			[
				'attrs' => [
					'contentControls' => null,
				],
			],
			[
				'attrs' => [
					'contentControls' => [
						'enabled' => false,
					],
				],
			],
			[
				'attrs' => [
					'contentControls' => [
						'enabled' => true,
					],
				],
			],
		];

		$expected_results = [
			false,
			false,
			false,
			true,
		];

		$frontend = new \ContentControl\Frontend( [] );

		foreach ( $test_attribute_sets as $i => $block ) {
			$this->assertSame( $frontend->has_block_controls( $block ), $expected_results[ $i ] );
		}
	}

	public function testGetBlockControls() {
		$test_block = [
			'attrs' => [
				'contentControls' => [
					'enabled' => true,
					'rules'   => [
						'device'       => [
							'onMobile'  => true,
							'onTablet'  => false,
							'onDesktop' => false,
						],
						'conditionals' => null,
					],
				],
			],
		];

		$frontend = new \ContentControl\Frontend( [] );

		$controls = $frontend->get_block_controls( $test_block );

		$this->assertSame( $controls, $test_block['attrs']['contentControls'] );
	}

	public function testAddBlockClasses() {
		$test_blocks_html = [
			'<p>Some text</p>',
			'<div class="gallery"><img src="#" /></div>',
			"<div class='gallery'><img src='#' /></div>",
			'<div class="gallery with-other-class" title="Some Title"></div>',
		];

		$expected_blocks_html = [
			'<p class="cc-hide-on-mobile">Some text</p>',
			'<div class="gallery cc-hide-on-mobile"><img src="#" /></div>',
			"<div class='gallery cc-hide-on-mobile'><img src='#' /></div>",
			'<div class="gallery with-other-class cc-hide-on-mobile" title="Some Title"></div>',
		];

		$test_block = [
			'attrs' => [
				'contentControls' => [
					'enabled' => true,
					'rules'   => [
						'device'       => [
							'hideOn' => [
								'mobile'  => true,
								'tablet'  => false,
								'desktop' => false,
							],
						],
						'conditionals' => null,
					],
				],
			],
		];

		$frontend = new \ContentControl\Frontend( [] );

		foreach ( $test_blocks_html as $i => $block_content ) {
			$this->assertSame( $expected_blocks_html[ $i ], $frontend->render_block( $block_content, $test_block ) );
		}
	}
}
