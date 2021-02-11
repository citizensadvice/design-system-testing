/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import { getByText, fireEvent, getByRole } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { JSDOM } from 'jsdom';
import path from 'path';
import waitForExpect from 'wait-for-expect';

import { getClosest, GreedyNavMenu } from './GreedyNav';
import { defaultConfig } from './Config';

const jsdomConfig = { url: 'http://public-website.test:3000' };

describe('getClosest', () => {
  let dom: JSDOM;
  let document: Document;
  let top: HTMLElement;
  let middle: HTMLElement;
  let bottom: HTMLElement;

  beforeEach(() => {
    dom = new JSDOM(
      '<div id="top" class="parent top" data-top="top"><div id="middle" class="parent middle" data-middle="middle"><div id="bottom" class="bottom" data-bottom="bottom"></div></div></div>',
      jsdomConfig
    );

    document = dom.window.document;

    top = document.querySelector<HTMLElement>('#top')!;
    middle = document.querySelector<HTMLElement>('#middle')!;
    bottom = document.querySelector<HTMLElement>('#bottom')!;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('finds direct ancestor node by id', () => {
    expect(getClosest(bottom, '#middle')).toBe(middle);
  });

  it('finds grandparent node by id', () => {
    expect(getClosest(bottom, '#top')).toBe(top);
  });

  it('finds parent by class', () => {
    expect(getClosest(bottom, '.parent')).toBe(middle);
  });

  it('finds grandparent by class', () => {
    expect(getClosest(bottom, '.top')).toBe(top);
  });

  it('finds parent by attribute', () => {
    expect(getClosest(bottom, '[data-middle]')).toEqual(middle);
  });

  it('finds grandparent by attribute', () => {
    expect(getClosest(bottom, '[data-top]')).toEqual(top);
  });

  it("doesn't find absent id", () => {
    expect(getClosest(bottom, '#no-there')).toBeFalsy();
  });

  it("doesn't find absent class", () => {
    expect(getClosest(bottom, '.not-there')).toBeFalsy();
  });

  it('returns false for absent attribute', () => {
    expect(getClosest(bottom, '[not-there]')).toBeFalsy();
  });
});

describe('GreeyNav', () => {
  let dom: JSDOM;
  let document: HTMLDocument;
  let nav: GreedyNavMenu;
  let navWrapper: HTMLElement;

  beforeEach(async () => {
    dom = await JSDOM.fromFile(
      path.join(__dirname, './__fixtures__/menu.html'),
      { url: 'http://www.example.com/menu.html' }
    );

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn().mockReturnValue(null),
      unobserve: jest.fn().mockReturnValue(null),
      disconnect: jest.fn().mockReturnValue(null),
    });

    window.IntersectionObserver = mockIntersectionObserver;

    document = dom.window.document;

    nav = new GreedyNavMenu(defaultConfig, document);
    nav.init();
    navWrapper = document.querySelector<HTMLElement>('.js-cads-greedy-nav');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.IntersectionObserver = null;
  });

  describe('dropdown', () => {
    beforeEach(async () => {
      // Change the viewport to 320px.
      global.innerWidth = 320;

      // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });

    afterEach(() => {
      global.innerWidth = 320;
      global.dispatchEvent(new Event('resize'));
    });

    it('appears when menu items overflow into it', () => {
      waitForExpect(() => {
        expect(getByText(navWrapper, 'More')).toBeVisible();
      });
    });

    it('disappears when the viewport is wide enough', () => {
      global.innerWidth = 1400;
      global.dispatchEvent(new Event('resize'));
      waitForExpect(() => {
        expect(getByText(navWrapper, 'More')).not.toBeVisible();
      });
    });

    it('opens the menu when tabbing into it', () => {
      fireEvent.keyUp(nav.navDropdownToggle, { key: 'Tab' });
    });

    it('closes the menu when tabbing out of it', () => {
      fireEvent.focus(nav.navDropdownToggle);
      fireEvent.blur(nav.navDropdownToggle);

      expect(getByText(navWrapper, 'More')).toBeVisible();
    });

    it('opens when clicking on the toggle', () => {
      const toggle = getByRole(navWrapper, 'button', {
        name: 'More navigation options',
      });
      toggle.click();

      expect(getByText(navWrapper, 'Close')).toBeVisible();
    });
  });

  describe('menu opening and closing', () => {
    describe('openDropDown', () => {
      it('opens the dropdown menu', () => {
        userEvent.click(nav.navDropdownToggle);

        expect(nav.navDropdown.classList).toContain('show');
      });

      it('sets aria-hidden to false on the drop down', () => {
        nav.openDropDown(nav.mainNavWrapper);

        expect(nav.navDropdown!).toHaveAttribute('aria-hidden', 'false');
      });
    });

    describe('closeDropDown', () => {
      beforeEach(() => {
        userEvent.click(nav.navDropdownToggle);
      });

      it('closes the dropdown menu', () => {
        userEvent.click(nav.navDropdownToggle);

        expect(nav.navDropdown).not.toContain('show');
      });

      it('sets aria-hidden to true on the drop down', () => {
        userEvent.click(nav.navDropdownToggle);

        expect(nav.navDropdown).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
