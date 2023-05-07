import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

const config: UserConfig = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'subject-full-stop': [RuleConfigSeverity.Error, 'always', '.'],
		'scope-enum': [
			RuleConfigSeverity.Disabled,
			'always',
			['AuthMS', 'PersonnelMS', 'StudentMS', 'ClubMS'],
		],
		'type-enum': [
			RuleConfigSeverity.Error,
			'always',
			[
				'init',
				'feat',
				'fix',
				'docs',
				'chore',
				'style',
				'refactor',
				'ci',
				'test',
				'perf',
				'revert',
				'build',
			],
		],
	},
};

module.exports = config;
