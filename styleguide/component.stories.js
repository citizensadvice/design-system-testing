/* eslint-disable camelcase */
import { withKnobs } from '@storybook/addon-knobs'; // eslint-disable-line
import { withA11y } from '@storybook/addon-a11y'; // eslint-disable-line
import { text } from '@storybook/addon-knobs'; // eslint-disable-line

// The styles
import './styles.scss';

import priorityNav from '@citizensadvice/priority-nav';
import initHeader from '../js/header';
import initTargetedContent from '../js/targeted-content';
import initCallouts from '../js/callout';

// eslint-disable-next-line
import locals from './haml_locals.rb'; // just used to watch
import wrapper from './component-wrapper';

import Buttons from './components/buttons';

// Haml setup
// Import all the templates...
import tCallout from '../haml/_callout.html.haml';
import tFooter from '../haml/_footer.html.haml';
import tHeader from '../haml/_header.html.haml';
import tLogo from '../haml/_logo_clickable.html.haml';
import tNavigation from '../haml/_navigation.html.haml';
import tSearch from '../haml/_search.html.haml';
import tNoticeBanner from '../haml/_notice_banner.html.haml';
import tBreadcrumb from '../haml/_breadcrumb.html.haml';
import tRadio from '../haml/_radio_group.html.haml';
import tRadioSmall from '../haml/_radio_group_small.html.haml';
import tTargetedContent from '../haml/_targeted-content.html.haml';
import tPageReview from '../haml/_page_review.html.haml';
import tInput from '../haml/_input.html.haml';
import tContactDetails from '../haml/_contact_details.html.haml';
import tWebsiteFeedback from '../haml/_website_feedback.html.haml';
import tSuccessMessage from '../haml/_success_message.html.haml';
import tTextarea from '../haml/_textarea.html.haml';
import tErrorSummary from '../haml/_error_summary.html.haml';

// Haml rendering wrapper for convenience
function renderHamlTemplate(
    templateName,
    template,
    hamlLocation,
    usage,
    optionalProps,
    optionalJS
) {
    return wrapper(
        templateName,
        template,
        `The partial is available in:
<pre class="html"><code>haml/_${hamlLocation}.html.haml</code></pre>
${usage || ''}`,
        optionalJS
    );
}

// Storybook section setup
export default {
    title: '3: Components',
    decorators: [withKnobs, withA11y],
    parameters: {
        options: {
            showPanel: true
        },
        a11y: {
            // optional selector which element to inspect
            element: '#a11yComponentToTest',
            // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
            config: {},
            // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
            options: {}
        }
    }
};

export const buttons = () => Buttons();

// The haml components. Thet will be sorted alphabetically so the order here is not important.
export const search = () => renderHamlTemplate('Search', tSearch, 'search');
export const footer = () => renderHamlTemplate('Footer', tFooter, 'footer');
export const header = () =>
    renderHamlTemplate(
        'Header',
        tHeader,
        'header',
        `The header component uses javascript to show/hide the search bar in small screen sizes.
\n\n
<code>import { initHeader } from @citizensadvice/design-system/js/header</code> and execute that function after the header html has loaded into the DOM.`,
        null,
        () => initHeader()
    );
export const input = () => renderHamlTemplate('Input', tInput, 'input');
export const textarea = () =>
    renderHamlTemplate('Textarea', tTextarea, 'textarea');
export const pageReview = () =>
    renderHamlTemplate('Page Review', tPageReview, 'page_review');
export const radioGroup = () =>
    renderHamlTemplate('Radio Group', tRadio, 'radio_group');
export const radioGroupSmall = () =>
    renderHamlTemplate('Radio Group (small)', tRadioSmall, 'radio_group_small');
export const breadcrumb = () =>
    renderHamlTemplate('Breadcrumbs', tBreadcrumb, 'breadcrumb');
export const errorSummary = () =>
    renderHamlTemplate(
        'Error summary',
        tErrorSummary,
        'error_summary',
        `The error summary is used to provide a summary of form errors.
You will need to provide the validation content and set the content.
To set the number of fields use the <code>cads-error-summery__field_count</code>
span and set the content to <code>1 field</code>, <code>5 fields</code>, etc.

Then use the <code>cads-error-summary__list</code> to add the relevant <code>li</code>
items.`
    );
export const logo = () =>
    renderHamlTemplate(
        'Logo',
        tLogo,
        'logo_clickable',
        `You can use the <code>cads-logo</code> class on anything to display the logo.
Make sure that an accessible title/etc is available.`
    );
export const navigation = () =>
    renderHamlTemplate(
        'Navigation',
        tNavigation,
        'navigation',
        `The navigation component uses javascript to display options in a dropdown menu that would otherwise appear off screen.
        \n\n
        <code>import { initNavigation } from @citizensadvice/design-system/js/navigation</code> and execute that function after the navigation components html has loaded into the DOM.`,
        null,
        () =>
            priorityNav.init({
                breakPoint: 0
            })
    );

export const noticeBanner = () =>
    renderHamlTemplate('Notice banner', tNoticeBanner, 'notice_banner');
export const callout = () =>
    renderHamlTemplate(
        'Callout',
        tCallout,
        'callout',
        `The callout component uses javascript to rearrange the heading level of the first callout on the screen (H2 vs H3 heading).
        \n\n
        <code>import { initCallouts } from @citizensadvice/design-system/js/callout</code> and execute that function after the the page has finished loading.`,
        null,
        initCallouts
    );
export const contactDetails = () =>
    renderHamlTemplate('Contact details', tContactDetails, 'contact_details');
export const websiteFeedback = () =>
    renderHamlTemplate(
        'Website Feedback',
        tWebsiteFeedback,
        'website_feedback'
    );
export const targetedContent = () =>
    renderHamlTemplate(
        'Targeted Content',
        tTargetedContent,
        'targeted-content',
        null,
        null,
        () => initTargetedContent()
    );

export const successMessage = () =>
    renderHamlTemplate('Success Message', tSuccessMessage, 'success_message');
