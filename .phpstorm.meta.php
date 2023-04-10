<?php
/**
 * This file declares all of the plugin containers available services and accessors for IDEs to read.
 *
 * NOTE: VS Code can use this file as well when the PHP Intelliphense extension is installed to provide autocompletion.
 *
 * @package ContentControl\Core
 */

namespace PHPSTORM_META;

/**
 * Provide autocompletion for plugin container access.
 *
 * Return lists below all must match, it cannot be defined as a variable.
 * Thus all the duplication is needed.
 */

/**
  * NOTE: applies specifically to using the Plugin getter directly.
  * Example Usage: $events = pum_Scheduling_plugin()->get( 'events' );
  */
  override( \ContentControl\Core\Plugin::get(0), map( [
    // Controllers.
    '' => '@',
    'connect' => \ContentControl\Core\Connect::class,
    'license' => \ContentControl\Core\License::class,
    'logging' => \ContentControl\Core\Logging::class,
    'options' => \ContentControl\Core\Options::class,
    'rules'   => \ContentControl\Rules::class,
    'upgrader'   => \ContentControl\Core\Upgrader::class,
  ] ) );

 /**
  * NOTE: applies specifically to using the global getter function.
  * Example Usage: $events = pum_scheduling( 'events' );
  */
  override ( \ContentControl\plugin(0), map( [
    // Controllers.
    '' => '@',
    'connect' => \ContentControl\Core\Connect::class,
    'license' => \ContentControl\Core\License::class,
    'logging' => \ContentControl\Core\Logging::class,
    'options' => \ContentControl\Core\Options::class,
    'rules'   => \ContentControl\Rules::class,
    'upgrader'   => \ContentControl\Core\Upgrader::class,
  ] ) );

  /**
  * NOTE: applies specifically to using the global getter function.
  * Example Usage: $events = pum_scheduling( 'events' );
  */
  override ( \ContentControl\Base\Container::get(0), map( [
    // Controllers.
    '' => '@',
    'connect' => \ContentControl\Core\Connect::class,
    'license' => \ContentControl\Core\License::class,
    'logging' => \ContentControl\Core\Logging::class,
    'options' => \ContentControl\Core\Options::class,
    'rules'   => \ContentControl\Rules::class,
    'upgrader'   => \ContentControl\Core\Upgrader::class,
  ] ) );

    /**
  * NOTE: applies specifically to using the global getter function.
  * Example Usage: $events = pum_scheduling( 'events' );
  */
override ( \ContentControl\Base\Container::offsetGet(0), map( [
  // Controllers.
  '' => '@',
  'connect' => \ContentControl\Core\Connect::class,
  'license' => \ContentControl\Core\License::class,
  'logging' => \ContentControl\Core\Logging::class,
  'options' => \ContentControl\Core\Options::class,
  'rules'   => \ContentControl\Rules::class,
  'upgrader'   => \ContentControl\Core\Upgrader::class,
] ) );
