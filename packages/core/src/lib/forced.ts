import {OptionConfig} from '../types/OptionConfig';
import {option} from '../decorators/option';

/**
 * A wrapper for @option that enables force mode on a type
 * @param name The name of the option
 * @param config The config for this option
 * @returns A property decorator
 */
export function forced(name: string, config: OptionConfig) {
	return option(name, {...config, force: true});
}
