// Test script for header synchronization between index.html and cek-nilai.html
// Run this in browser console on both pages to verify synchronization

console.log('=== HEADER SYNCHRONIZATION TEST ===');

// Test 1: Check WhatsApp links
function testWhatsAppLinks() {
    console.log('\n1. Testing WhatsApp Links...');

    const expectedNumber = '+6285134913931';
    const expectedMessage = 'Halo%20Admin%20Bimbel%20Edumag,%20saya%20ingin%20berkonsultasi';
    const expectedUrl = `https://wa.me/${expectedNumber.replace('+', '')}?text=${expectedMessage}`;

    // Test floating CTA
    const floatingCTA = document.querySelector('.floating-cta');
    if (floatingCTA) {
        const floatingHref = floatingCTA.getAttribute('href');
        console.log('Floating CTA href:', floatingHref);
        console.log('Expected:', expectedUrl);
        console.log('Match:', floatingHref === expectedUrl ? '✅ PASS' : '❌ FAIL');
    } else {
        console.log('❌ FAIL: Floating CTA not found');
    }

    // Test desktop nav WhatsApp button
    const desktopWA = document.querySelector('.nav-links .btn-primary');
    if (desktopWA) {
        const desktopHref = desktopWA.getAttribute('href');
        console.log('Desktop WA href:', desktopHref);
        console.log('Expected:', expectedUrl);
        console.log('Match:', desktopHref === expectedUrl ? '✅ PASS' : '❌ FAIL');
    } else {
        console.log('❌ FAIL: Desktop WhatsApp button not found');
    }

    // Test mobile menu WhatsApp button
    const mobileWA = document.querySelector('.mobile-menu .btn-primary');
    if (mobileWA) {
        const mobileHref = mobileWA.getAttribute('href');
        console.log('Mobile WA href:', mobileHref);
        console.log('Expected:', expectedUrl);
        console.log('Match:', mobileHref === expectedUrl ? '✅ PASS' : '❌ FAIL');
    } else {
        console.log('❌ FAIL: Mobile WhatsApp button not found');
    }
}

// Test 2: Check navigation structure
function testNavigationStructure() {
    console.log('\n2. Testing Navigation Structure...');

    const expectedLinks = [
        '#masterkey',
        '#visi-misi',
        '#program',
        '#keunggulan',
        '#testimoni',
        'cek-nilai.html',
        'blog.html',
        '#faq'
    ];

    // Test desktop navigation
    const desktopLinks = document.querySelectorAll('.nav-links a:not(.btn-primary)');
    console.log('Desktop nav links found:', desktopLinks.length);
    console.log('Expected:', expectedLinks.length);

    let desktopMatch = true;
    desktopLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        if (href !== expectedLinks[index]) {
            console.log(`❌ FAIL: Desktop link ${index} - Expected: ${expectedLinks[index]}, Got: ${href}`);
            desktopMatch = false;
        }
    });

    if (desktopMatch && desktopLinks.length === expectedLinks.length) {
        console.log('✅ PASS: Desktop navigation structure matches');
    }

    // Test mobile navigation
    const mobileLinks = document.querySelectorAll('.mobile-menu .nav-links a:not(.btn-primary)');
    console.log('Mobile nav links found:', mobileLinks.length);

    let mobileMatch = true;
    mobileLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        if (href !== expectedLinks[index]) {
            console.log(`❌ FAIL: Mobile link ${index} - Expected: ${expectedLinks[index]}, Got: ${href}`);
            mobileMatch = false;
        }
    });

    if (mobileMatch && mobileLinks.length === expectedLinks.length) {
        console.log('✅ PASS: Mobile navigation structure matches');
    }
}

// Test 3: Check hamburger menu functionality
function testHamburgerMenu() {
    console.log('\n3. Testing Hamburger Menu...');

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!hamburger || !mobileMenu || !overlay) {
        console.log('❌ FAIL: Hamburger menu elements not found');
        return;
    }

    console.log('✅ PASS: Hamburger menu elements found');

    // Check initial state
    const initialMenuActive = mobileMenu.classList.contains('active');
    const initialOverlayActive = overlay.classList.contains('active');
    const initialHamburgerActive = hamburger.classList.contains('active');

    console.log('Initial state - Menu active:', initialMenuActive, 'Overlay active:', initialOverlayActive, 'Hamburger active:', initialHamburgerActive);

    if (!initialMenuActive && !initialOverlayActive && !initialHamburgerActive) {
        console.log('✅ PASS: Initial state is correct (closed)');
    } else {
        console.log('❌ FAIL: Initial state is incorrect');
    }
}

// Test 4: Check responsive elements
function testResponsiveElements() {
    console.log('\n4. Testing Responsive Elements...');

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (hamburger && mobileMenu && overlay) {
        console.log('✅ PASS: All responsive elements present');
    } else {
        console.log('❌ FAIL: Missing responsive elements');
    }

    // Check if js/main.js is loaded
    const scripts = document.querySelectorAll('script');
    let mainJsLoaded = false;
    scripts.forEach(script => {
        if (script.src.includes('js/main.js')) {
            mainJsLoaded = true;
        }
    });

    console.log('js/main.js loaded:', mainJsLoaded ? '✅ PASS' : '❌ FAIL');
}

// Test 5: Check logo and branding
function testLogoAndBranding() {
    console.log('\n5. Testing Logo and Branding...');

    const logo = document.querySelector('.logo');
    const logoImage = document.querySelector('.logo-image');
    const logoText = document.querySelector('.logo-text');

    if (logo && logoImage && logoText) {
        console.log('✅ PASS: Logo elements present');

        const logoHref = logo.getAttribute('href');
        console.log('Logo href:', logoHref);
        console.log('Expected: index.html');
        console.log('Match:', logoHref === 'index.html' ? '✅ PASS' : '❌ FAIL');
    } else {
        console.log('❌ FAIL: Logo elements missing');
    }
}

// Run all tests
testWhatsAppLinks();
testNavigationStructure();
testHamburgerMenu();
testResponsiveElements();
testLogoAndBranding();

console.log('\n=== TEST COMPLETE ===');
console.log('Manual checks needed:');
console.log('- Test hamburger menu toggle in mobile view');
console.log('- Verify WhatsApp links open correctly');
console.log('- Check responsive behavior across different screen sizes');
console.log('- Compare visual styling with index.html');
