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

		$frontend = new \ContentControl\Frontend();

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

		$frontend = new \ContentControl\Frontend();

		$controls = $frontend->get_block_controls( $test_block );

		$this->assertSame( $controls, $test_block['attrs']['contentControls'] );
	}

}
