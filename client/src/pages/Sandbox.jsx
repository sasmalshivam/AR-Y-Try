import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import Navbar from '../components/Navbar';

// ─── ARYAĀ DESIGN TOKENS ─────────────────────────────────
const T = {
  ink: '#0a0a0f',
  inkLight: '#111827',
  inkMid: '#1a2035',
  gold: '#c9a84c',
  goldLight: '#e8d5a3',
  goldPale: 'rgba(201,168,76,0.08)',
  goldBorder: 'rgba(201,168,76,0.25)',
  cream: '#f5f0e8',
  creamMuted: 'rgba(245,240,232,0.55)',
  creamDim: 'rgba(245,240,232,0.25)',
  rust: '#b84a2e',
  sage: '#4a6741',
  glass: 'rgba(255,255,255,0.04)',
  glassBorder: 'rgba(255,255,255,0.09)',
  glassBorderHover: 'rgba(255,255,255,0.18)',
};

// ─── AVATAR PALETTE ──────────────────────────────────────
const PALETTE = {
  skin: {
    porcelain: { hex: '#ffe0c8', label: 'Porcelain' },
    ivory: { hex: '#f5cba7', label: 'Ivory' },
    sand: { hex: '#d2a170', label: 'Sand' },
    caramel: { hex: '#b5783a', label: 'Caramel' },
    mahogany: { hex: '#8d5524', label: 'Mahogany' },
    ebony: { hex: '#4a2c17', label: 'Ebony' },
  },
  hair: {
    raven: { hex: '#1a1a1a', label: 'Raven' },
    espresso: { hex: '#3b1f0f', label: 'Espresso' },
    auburn: { hex: '#7c2f10', label: 'Auburn' },
    chestnut: { hex: '#8b4513', label: 'Chestnut' },
    honey: { hex: '#c8860a', label: 'Honey' },
    platinum: { hex: '#e8e0d0', label: 'Platinum' },
    silver: { hex: '#a0a0a0', label: 'Silver' },
    rose: { hex: '#c8547a', label: 'Rose' },
  },
  tops: {
    chalk: { hex: '#f8fafc', label: 'Chalk' },
    obsidian: { hex: '#1f2937', label: 'Obsidian' },
    crimson: { hex: '#ef4444', label: 'Crimson' },
    cobalt: { hex: '#3b82f6', label: 'Cobalt' },
    emerald: { hex: '#10b981', label: 'Emerald' },
    amber: { hex: '#f59e0b', label: 'Amber' },
    lavender: { hex: '#8b5cf6', label: 'Lavender' },
    rose: { hex: '#ec4899', label: 'Rose' },
    slate: { hex: '#64748b', label: 'Slate' },
    olive: { hex: '#65a30d', label: 'Olive' },
  },
  bottoms: {
    denim: { hex: '#1e3a8a', label: 'Denim' },
    onyx: { hex: '#111827', label: 'Onyx' },
    khaki: { hex: '#c2b280', label: 'Khaki' },
    blush: { hex: '#ec4899', label: 'Blush' },
    camel: { hex: '#d97706', label: 'Camel' },
    slate: { hex: '#475569', label: 'Slate' },
    olive: { hex: '#4d7c0f', label: 'Olive' },
    cream: { hex: '#fef3c7', label: 'Cream' },
  },
  shoes: {
    obsidian: { hex: '#111827', label: 'Obsidian' },
    chalk: { hex: '#f8fafc', label: 'Chalk' },
    tan: { hex: '#b45309', label: 'Tan' },
    crimson: { hex: '#dc2626', label: 'Crimson' },
    navy: { hex: '#1e3a8a', label: 'Navy' },
    smoke: { hex: '#6b7280', label: 'Smoke' },
  },
};

const STYLES = {
  tops: [
    { id: 'tee', label: 'Classic Tee' },
    { id: 'polo', label: 'Polo Shirt' },
    { id: 'hoodie', label: 'Hoodie' },
    { id: 'blazer', label: 'Blazer' },
    { id: 'turtleneck', label: 'Turtleneck' },
    { id: 'tanktop', label: 'Tank Top' },
  ],
  bottoms: [
    { id: 'jeans', label: 'Slim Jeans' },
    { id: 'chinos', label: 'Chinos' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'skirt', label: 'Skirt' },
    { id: 'skirt_long', label: 'Maxi Skirt' },
  ],
  shoes: [
    { id: 'sneakers', label: 'Sneakers' },
    { id: 'boots', label: 'Boots' },
    { id: 'loafers', label: 'Loafers' },
    { id: 'heels', label: 'Heels' },
    { id: 'sandals', label: 'Sandals' },
  ],
  eyewear: [
    { id: 'none', label: 'None' },
    { id: 'glasses', label: 'Frames' },
    { id: 'sunglasses', label: 'Aviators' },
    { id: 'goggles', label: 'Goggles' },
    { id: 'visor', label: 'Visor' },
  ],
  hats: [
    { id: 'none', label: 'None' },
    { id: 'cap', label: 'Ball Cap' },
    { id: 'beanie', label: 'Beanie' },
    { id: 'fedora', label: 'Fedora' },
    { id: 'bucket', label: 'Bucket Hat' },
  ],
  earrings: [
    { id: 'none', label: 'None' },
    { id: 'studs', label: 'Studs' },
    { id: 'hoops', label: 'Hoops' },
    { id: 'drops', label: 'Drops' },
    { id: 'cuffs', label: 'Cuffs' },
  ],
  watches: [
    { id: 'none', label: 'None' },
    { id: 'smartwatch', label: 'Smart' },
    { id: 'classic', label: 'Classic' },
    { id: 'sport', label: 'Sport' },
    { id: 'luxury', label: 'Luxury' },
  ],
  necklaces: [
    { id: 'none', label: 'None' },
    { id: 'pendant', label: 'Pendant' },
    { id: 'chain', label: 'Chain' },
    { id: 'choker', label: 'Choker' },
  ],
  bags: [
    { id: 'none', label: 'None' },
    { id: 'backpack', label: 'Backpack' },
    { id: 'tote', label: 'Tote' },
    { id: 'crossbody', label: 'Crossbody' },
  ],
};

// ─── THREE.JS AVATAR ────────────────────────────────────
function ThreeCanvas({ state }) {
  const mountRef = useRef(null);
  const refs = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 1.5, 11);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xfff4e0, 1.4);
    key.position.set(-4, 10, 6); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe0e8ff, 0.4);
    fill.position.set(6, 4, -4); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9a84c, 0.3);
    rim.position.set(0, 8, -8); scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.2;
    ground.receiveShadow = true;
    scene.add(ground);

    const mats = {
      skin: new THREE.MeshStandardMaterial({ color: 0xffe0c8, roughness: 0.5, metalness: 0 }),
      hair: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0 }),
      top: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.75, metalness: 0 }),
      bottom: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8, metalness: 0 }),
      shoe: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4, metalness: 0.15 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.2, metalness: 0.9 }),
      silver: new THREE.MeshStandardMaterial({ color: 0xa0a8b0, roughness: 0.25, metalness: 0.85 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.4 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.7 }),
      screen: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      accent: new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.3, metalness: 0.7 }),
    };

    const shadow = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
    const box = (w, h, d, mat, pos, shdw = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(...pos); if (shdw) shadow(m); return m;
    };
    const cyl = (rt, rb, h, seg, mat, pos) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
      m.position.set(...pos); shadow(m); return m;
    };
    const sph = (r, mat, pos) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);
      m.position.set(...pos); shadow(m); return m;
    };

    const avatar = new THREE.Group();
    avatar.position.set(0, -2.5, 0);
    scene.add(avatar);

    const headGrp = new THREE.Group();
    headGrp.position.set(0, 6.1, 0);
    avatar.add(headGrp);

    const head = box(1.4, 1.5, 1.3, mats.skin, [0, 0, 0]);
    headGrp.add(head);

    const hairBase = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.55, 1.35), mats.hair);
    hairBase.position.set(0, 0.55, 0); headGrp.add(hairBase);
    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.0, 0.3), mats.hair);
    hairBack.position.set(0, 0.1, -0.65); headGrp.add(hairBack);
    const hairSideL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 1.0), mats.hair);
    hairSideL.position.set(-0.72, 0.1, 0); headGrp.add(hairSideL);
    const hairSideR = hairSideL.clone(); hairSideR.position.x = 0.72; headGrp.add(hairSideR);

    headGrp.add(box(0.2, 0.14, 0.05, mats.dark, [-0.35, 0.1, 0.66], false));
    headGrp.add(box(0.2, 0.14, 0.05, mats.dark, [0.35, 0.1, 0.66], false));
    headGrp.add(box(0.1, 0.14, 0.12, mats.skin, [0, -0.08, 0.72], false));
    headGrp.add(box(0.28, 0.07, 0.05, mats.dark, [0, -0.3, 0.67], false));

    const parts = {};
    const eyewearGrp = new THREE.Group(); headGrp.add(eyewearGrp);
    const lensL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.05), mats.glass);
    lensL.position.set(-0.35, 0.12, 0.7);
    const lensR = lensL.clone(); lensR.position.x = 0.35;
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.05), mats.dark);
    bridge.position.set(0, 0.12, 0.7);
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.7), mats.dark);
    armL.position.set(-0.6, 0.12, 0.38);
    const armR = armL.clone(); armR.position.x = 0.6;
    eyewearGrp.add(lensL, lensR, bridge, armL, armR);
    parts.eyewearGlasses = eyewearGrp;

    const aviatorGrp = new THREE.Group(); headGrp.add(aviatorGrp);
    const avLensL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.06), new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 }));
    avLensL.position.set(-0.35, 0.1, 0.7);
    const avLensR = avLensL.clone(); avLensR.position.x = 0.35;
    const avBridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.06), mats.accent);
    avBridge.position.set(0, 0.1, 0.7);
    const avArmL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.65), mats.accent);
    avArmL.position.set(-0.61, 0.1, 0.4);
    const avArmR = avArmL.clone(); avArmR.position.x = 0.61;
    aviatorGrp.add(avLensL, avLensR, avBridge, avArmL, avArmR);
    parts.eyewearSunglasses = aviatorGrp;

    const gogglesGrp = new THREE.Group(); headGrp.add(gogglesGrp);
    const gStrap = box(1.55, 0.22, 1.55, mats.dark, [0, 0.1, 0]);
    const gLensL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 20), mats.glass);
    gLensL.rotation.x = Math.PI / 2; gLensL.position.set(-0.37, 0.1, 0.8);
    const gLensR = gLensL.clone(); gLensR.position.x = 0.37;
    gogglesGrp.add(gStrap, gLensL, gLensR);
    parts.eyewearGoggles = gogglesGrp;

    const visorGrp = new THREE.Group(); headGrp.add(visorGrp);
    visorGrp.add(box(1.5, 0.1, 0.9, mats.dark, [0, 0.75, 0.35]));
    parts.eyewearVisor = visorGrp;

    const capGrp = new THREE.Group(); headGrp.add(capGrp);
    capGrp.add(box(1.5, 0.45, 1.5, mats.top, [0, 0.98, 0]), box(1.5, 0.1, 0.9, mats.top, [0, 0.78, 0.65]));
    parts.hatCap = capGrp;

    const beanieGrp = new THREE.Group(); headGrp.add(beanieGrp);
    const beanieMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.74, 0.65, 20), mats.hair);
    beanieMesh.position.set(0, 0.9, 0);
    const beanieRib = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.2, 20), mats.dark);
    beanieRib.position.set(0, 0.63, 0);
    beanieGrp.add(beanieMesh, beanieRib);
    parts.hatBeanie = beanieGrp;

    const fedoraGrp = new THREE.Group(); headGrp.add(fedoraGrp);
    const fedoraCrown = cyl(0.55, 0.66, 0.8, 20, mats.dark, [0, 1.12, 0]);
    const fedoraBrim = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.08, 20), mats.dark);
    fedoraBrim.position.set(0, 0.74, 0);
    fedoraGrp.add(fedoraCrown, fedoraBrim);
    parts.hatFedora = fedoraGrp;

    const bucketGrp = new THREE.Group(); headGrp.add(bucketGrp);
    const bucketTop = cyl(0.6, 0.72, 0.65, 20, mats.top, [0, 1.0, 0]);
    const bucketBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.15, 20), mats.top);
    bucketBrim.position.set(0, 0.68, 0);
    bucketGrp.add(bucketTop, bucketBrim);
    parts.hatBucket = bucketGrp;

    const earringsGrp = new THREE.Group(); headGrp.add(earringsGrp);
    const studsGrp = new THREE.Group();
    studsGrp.add(sph(0.1, mats.silver, [-0.75, -0.2, 0]), sph(0.1, mats.silver, [0.75, -0.2, 0]));
    earringsGrp.add(studsGrp); parts.earringsStuds = studsGrp;

    const hoopsGrp = new THREE.Group();
    [[-0.76], [0.76]].forEach(([x]) => {
      const h = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 8, 20), mats.gold);
      h.position.set(x, -0.25, 0); h.rotation.y = Math.PI / 2;
      hoopsGrp.add(h);
    });
    earringsGrp.add(hoopsGrp); parts.earringsHoops = hoopsGrp;

    const dropsGrp = new THREE.Group();
    [[-0.76], [0.76]].forEach(([x]) => {
      dropsGrp.add(box(0.03, 0.22, 0.03, mats.gold, [x, -0.32, 0], false), sph(0.1, new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.05, metalness: 0.3 }), [x, -0.48, 0]));
    });
    earringsGrp.add(dropsGrp); parts.earringsDrops = dropsGrp;

    const cuffsGrp = new THREE.Group();
    [[-0.76], [0.76]].forEach(([x]) => {
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.06, 8, 12, Math.PI * 1.6), mats.gold);
      cuff.position.set(x, -0.2, 0); cuff.rotation.y = Math.PI / 2;
      cuffsGrp.add(cuff);
    });
    earringsGrp.add(cuffsGrp); parts.earringsCuffs = cuffsGrp;

    const neckGrp = new THREE.Group(); avatar.add(neckGrp);
    neckGrp.add(cyl(0.3, 0.35, 0.55, 12, mats.skin, [0, 4.85, 0]));

    const necklaceGrp = new THREE.Group(); neckGrp.add(necklaceGrp);
    const pendantGrp = new THREE.Group();
    const pChain = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 24, Math.PI), mats.silver);
    pChain.position.set(0, 4.6, 0.1); pChain.rotation.x = Math.PI / 6;
    pendantGrp.add(pChain, sph(0.1, new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.2, roughness: 0.1 }), [0, 4.28, 0.42]));
    necklaceGrp.add(pendantGrp); parts.necklacePendant = pendantGrp;

    const chainGrp = new THREE.Group();
    const chn = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 8, 24, Math.PI), mats.gold);
    chn.position.set(0, 4.55, 0.1); chn.rotation.x = Math.PI / 6;
    chainGrp.add(chn); necklaceGrp.add(chainGrp); parts.necklaceChain = chainGrp;

    const chokerGrp = new THREE.Group();
    const chk = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 8, 24, Math.PI * 1.9), mats.dark);
    chk.position.set(0, 4.72, 0.06); chk.rotation.x = Math.PI / 9;
    chokerGrp.add(chk); necklaceGrp.add(chokerGrp); parts.necklaceChoker = chokerGrp;

    const torso = box(2.1, 2.6, 1.1, mats.top, [0, 3.7, 0]);
    avatar.add(torso); parts.torso = torso;

    const blazerGrp = new THREE.Group(); avatar.add(blazerGrp);
    const lapelL = box(0.35, 1.4, 0.08, mats.bottom, [-0.5, 3.9, 0.57]); lapelL.rotation.z = 0.15;
    const lapelR = box(0.35, 1.4, 0.08, mats.bottom, [0.5, 3.9, 0.57]); lapelR.rotation.z = -0.15;
    blazerGrp.add(lapelL, lapelR, box(0.7, 0.35, 0.08, mats.top, [0, 4.7, 0.57]));
    parts.blazerDetails = blazerGrp;

    const hoodieGrp = new THREE.Group(); avatar.add(hoodieGrp);
    hoodieGrp.add(box(0.9, 0.5, 0.06, mats.dark, [0, 3.0, 0.58]));
    parts.hoodieDetails = hoodieGrp;

    const turtleGrp = new THREE.Group(); avatar.add(turtleGrp);
    turtleGrp.add(cyl(0.38, 0.42, 0.6, 16, mats.top, [0, 5.0, 0]));
    parts.turtleneckDetails = turtleGrp;

    const tankGrp = new THREE.Group(); avatar.add(tankGrp);
    tankGrp.add(box(0.22, 0.5, 0.06, mats.top, [-0.55, 4.6, 0.57]), box(0.22, 0.5, 0.06, mats.top, [0.55, 4.6, 0.57]));
    parts.tankDetails = tankGrp;

    const lArmGrp = new THREE.Group(); lArmGrp.position.set(-1.55, 4.9, 0); avatar.add(lArmGrp);
    lArmGrp.add(box(0.7, 1.4, 0.7, mats.top, [0, -0.7, 0]), box(0.65, 1.2, 0.65, mats.skin, [0, -1.95, 0]), box(0.6, 0.65, 0.55, mats.skin, [0, -2.9, 0]));
    parts.lArmGrp = lArmGrp;

    const watchGrp = new THREE.Group(); watchGrp.position.set(0, -2.3, 0); lArmGrp.add(watchGrp);
    const swGrp = new THREE.Group();
    const swFace = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.55), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.1 }));
    swFace.position.set(-0.38, 0, 0);
    swGrp.add(box(0.7, 0.22, 0.72, mats.dark, [0, 0, 0]), swFace, box(0.42, 0.38, 0.1, mats.screen, [-0.38, 0, 0.28], false));
    watchGrp.add(swGrp); parts.watchSmart = swGrp;

    const cwGrp = new THREE.Group();
    const cwDial = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 20), mats.gold);
    cwDial.rotation.z = Math.PI / 2; cwDial.position.set(-0.39, 0, 0);
    cwGrp.add(box(0.7, 0.18, 0.72, mats.silver, [0, 0, 0]), cwDial);
    watchGrp.add(cwGrp); parts.watchClassic = cwGrp;

    const spGrp = new THREE.Group();
    const spBand = box(0.72, 0.2, 0.72, mats.dark, [0, 0, 0]); spBand.material = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 });
    spGrp.add(spBand, box(0.5, 0.12, 0.5, mats.dark, [-0.38, 0, 0]));
    watchGrp.add(spGrp); parts.watchSport = spGrp;

    const lxGrp = new THREE.Group();
    const lxDial = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 20), mats.gold);
    lxDial.rotation.z = Math.PI / 2; lxDial.position.set(-0.4, 0, 0);
    lxGrp.add(box(0.72, 0.2, 0.72, mats.gold, [0, 0, 0]), lxDial, sph(0.08, mats.silver, [-0.4, 0.14, 0]));
    watchGrp.add(lxGrp); parts.watchLuxury = lxGrp;

    const rArmGrp = new THREE.Group(); rArmGrp.position.set(1.55, 4.9, 0); avatar.add(rArmGrp);
    rArmGrp.add(box(0.7, 1.4, 0.7, mats.top, [0, -0.7, 0]), box(0.65, 1.2, 0.65, mats.skin, [0, -1.95, 0]), box(0.6, 0.65, 0.55, mats.skin, [0, -2.9, 0]));
    parts.rArmGrp = rArmGrp;

    const legsGrp = new THREE.Group(); avatar.add(legsGrp);
    const pantsGrp = new THREE.Group(); legsGrp.add(pantsGrp);
    pantsGrp.add(box(0.88, 2.6, 0.88, mats.bottom, [-0.5, 1.3, 0]), box(0.88, 2.6, 0.88, mats.bottom, [0.5, 1.3, 0]));
    parts.pantsGrp = pantsGrp;

    const shortsGrp = new THREE.Group(); legsGrp.add(shortsGrp);
    shortsGrp.add(box(0.88, 1.2, 0.88, mats.bottom, [-0.5, 1.9, 0]), box(0.88, 1.2, 0.88, mats.bottom, [0.5, 1.9, 0]), box(0.85, 1.5, 0.85, mats.skin, [-0.5, 0.75, 0]), box(0.85, 1.5, 0.85, mats.skin, [0.5, 0.75, 0]));
    parts.shortsGrp = shortsGrp;

    const skirtGrp = new THREE.Group(); legsGrp.add(skirtGrp);
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.35, 1.6, 4), mats.bottom);
    sk.position.set(0, 1.8, 0); sk.rotation.y = Math.PI / 4; shadow(sk);
    skirtGrp.add(sk, box(0.82, 1.8, 0.82, mats.skin, [-0.5, 0.9, 0]), box(0.82, 1.8, 0.82, mats.skin, [0.5, 0.9, 0]));
    parts.skirtGrp = skirtGrp;

    const maxiGrp = new THREE.Group(); legsGrp.add(maxiGrp);
    const maxi = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 2.8, 6), mats.bottom);
    maxi.position.set(0, 1.4, 0); maxi.rotation.y = Math.PI / 6; shadow(maxi);
    maxiGrp.add(maxi); parts.maxiGrp = maxiGrp;

    const shoesGrp = new THREE.Group(); avatar.add(shoesGrp); parts.shoesGrp = shoesGrp;

    const snkGrp = new THREE.Group();
    [[-0.5], [0.5]].forEach(([x]) => {
      snkGrp.add(box(0.92, 0.5, 1.15, mats.shoe, [x, -0.25, 0.1]), box(0.96, 0.2, 1.2, mats.silver, [x, -0.5, 0.1]), box(0.62, 0.5, 0.15, mats.shoe, [x, -0.2, 0.55]));
    });
    shoesGrp.add(snkGrp); parts.shoeSneakers = snkGrp;

    const bootGrp = new THREE.Group();
    [[-0.5], [0.5]].forEach(([x]) => {
      bootGrp.add(box(0.9, 0.5, 1.1, mats.shoe, [x, -0.25, 0.1]), box(0.88, 0.8, 0.92, mats.shoe, [x, 0.15, -0.05]), box(0.94, 0.18, 1.15, mats.dark, [x, -0.5, 0.1]));
    });
    shoesGrp.add(bootGrp); parts.shoeBoots = bootGrp;

    const loaferGrp = new THREE.Group();
    [[-0.5], [0.5]].forEach(([x]) => {
      loaferGrp.add(box(0.9, 0.45, 1.1, mats.shoe, [x, -0.28, 0.05]), box(0.5, 0.12, 0.06, mats.accent, [x, -0.05, 0.55]));
    });
    shoesGrp.add(loaferGrp); parts.shoeLoafers = loaferGrp;

    const heelGrp = new THREE.Group();
    [[-0.5], [0.5]].forEach(([x]) => {
      heelGrp.add(box(0.86, 0.35, 0.95, mats.shoe, [x, -0.28, 0.05]), box(0.2, 0.6, 0.22, mats.shoe, [x, -0.3, -0.42]));
    });
    shoesGrp.add(heelGrp); parts.shoeHeels = heelGrp;

    const sandalGrp = new THREE.Group();
    [[-0.5], [0.5]].forEach(([x]) => {
      sandalGrp.add(box(0.9, 0.2, 1.1, mats.shoe, [x, -0.45, 0.05]), box(0.92, 0.16, 0.15, mats.accent, [x, -0.25, 0.35]), box(0.92, 0.16, 0.15, mats.accent, [x, -0.25, -0.1]));
    });
    shoesGrp.add(sandalGrp); parts.shoeSandals = sandalGrp;

    const bagGrp = new THREE.Group(); avatar.add(bagGrp); parts.bagGrp = bagGrp;

    const backpackGrp = new THREE.Group();
    backpackGrp.add(box(1.3, 1.6, 0.55, mats.dark, [0, 3.6, -0.75]), box(1.1, 0.35, 0.5, mats.dark, [0, 4.45, -0.73]), box(1.0, 0.7, 0.12, mats.dark, [0, 3.15, -1.06]));
    bagGrp.add(backpackGrp); parts.bagBackpack = backpackGrp;

    const toteGrp = new THREE.Group();
    const toteHandle = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, 16, Math.PI), mats.dark);
    toteHandle.position.set(2.0, 3.4, 0); toteHandle.rotation.z = Math.PI;
    toteGrp.add(box(1.4, 1.2, 0.45, mats.dark, [2.0, 2.4, 0]), toteHandle);
    bagGrp.add(toteGrp); parts.bagTote = toteGrp;

    const crossGrp = new THREE.Group();
    crossGrp.add(box(0.85, 0.85, 0.3, mats.dark, [1.6, 2.8, 0]), box(0.06, 2.8, 0.06, mats.dark, [1.05, 3.6, 0]));
    bagGrp.add(crossGrp); parts.bagCrossbody = crossGrp;

    refs.current = { avatar, mats, parts, camera, renderer };

    let drag = false;
    let rotY = 0, rotX = 0, tRotY = 0, tRotX = 0;
    const dom = renderer.domElement;

    dom.addEventListener('mousedown', () => { drag = true; });
    dom.addEventListener('mousemove', (e) => {
      if (drag) { tRotY += e.movementX * 0.012; tRotX = Math.max(-0.45, Math.min(0.45, tRotX + e.movementY * 0.012)); }
    });
    dom.addEventListener('mouseup', () => { drag = false; });
    dom.addEventListener('mouseleave', () => { drag = false; });

    let pt = null;
    dom.addEventListener('touchstart', (e) => { drag = true; pt = e.touches[0]; });
    dom.addEventListener('touchmove', (e) => {
      if (drag && pt) {
        const t = e.touches[0];
        tRotY += (t.clientX - pt.clientX) * 0.012;
        tRotX = Math.max(-0.45, Math.min(0.45, tRotX + (t.clientY - pt.clientY) * 0.012));
        pt = t;
      }
    });
    dom.addEventListener('touchend', () => { drag = false; pt = null; });

    const startTime = performance.now();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;

      if (!drag) tRotY += 0.004;
      rotY += (tRotY - rotY) * 0.1;
      rotX += (tRotX - rotX) * 0.1;

      camera.position.x = Math.sin(rotY) * 11;
      camera.position.z = Math.cos(rotY) * 11;
      camera.position.y = 1.5 + rotX * 8;
      camera.lookAt(0, 1, 0);

      avatar.position.y = -2.5 + Math.sin(t * 1.8) * 0.055;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const W2 = mountRef.current.clientWidth, H2 = mountRef.current.clientHeight;
      if (W2 === 0 || H2 === 0) return;
      camera.aspect = W2 / H2; camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    
    const ro = new ResizeObserver(onResize);
    ro.observe(mountRef.current);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mountRef.current?.contains(renderer.domElement)) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!refs.current) return;
    const { mats, parts } = refs.current;
    const s = state;

    mats.skin.color.set(PALETTE.skin[s.skin]?.hex || '#ffe0c8');
    mats.hair.color.set(PALETTE.hair[s.hair]?.hex || '#1a1a1a');
    mats.top.color.set(PALETTE.tops[s.topColor]?.hex || '#f8fafc');
    mats.bottom.color.set(PALETTE.bottoms[s.bottomColor]?.hex || '#1e3a8a');
    mats.shoe.color.set(PALETTE.shoes[s.shoeColor]?.hex || '#111827');

    if (parts.hatCap) {
      parts.hatCap.children.forEach(c => c.material = mats.top);
    }

    const fem = s.gender === 'female';
    parts.torso.scale.set(fem ? 0.88 : 1, 1, fem ? 0.85 : 1);
    parts.lArmGrp.position.x = fem ? -1.4 : -1.55;
    parts.rArmGrp.position.x = fem ? 1.4 : 1.55;

    parts.eyewearGlasses.visible = s.eyewear === 'glasses';
    parts.eyewearSunglasses.visible = s.eyewear === 'sunglasses';
    parts.eyewearGoggles.visible = s.eyewear === 'goggles';
    parts.eyewearVisor.visible = s.eyewear === 'visor';

    parts.hatCap.visible = s.hat === 'cap';
    parts.hatBeanie.visible = s.hat === 'beanie';
    parts.hatFedora.visible = s.hat === 'fedora';
    parts.hatBucket.visible = s.hat === 'bucket';

    parts.earringsStuds.visible = s.earrings === 'studs';
    parts.earringsHoops.visible = s.earrings === 'hoops';
    parts.earringsDrops.visible = s.earrings === 'drops';
    parts.earringsCuffs.visible = s.earrings === 'cuffs';

    parts.necklacePendant.visible = s.necklace === 'pendant';
    parts.necklaceChain.visible = s.necklace === 'chain';
    parts.necklaceChoker.visible = s.necklace === 'choker';

    parts.watchSmart.visible = s.watch === 'smartwatch';
    parts.watchClassic.visible = s.watch === 'classic';
    parts.watchSport.visible = s.watch === 'sport';
    parts.watchLuxury.visible = s.watch === 'luxury';

    parts.blazerDetails.visible = s.topStyle === 'blazer';
    parts.hoodieDetails.visible = s.topStyle === 'hoodie';
    parts.turtleneckDetails.visible = s.topStyle === 'turtleneck';
    parts.tankDetails.visible = s.topStyle === 'tanktop';

    parts.pantsGrp.visible = s.bottomStyle === 'jeans' || s.bottomStyle === 'chinos';
    parts.shortsGrp.visible = s.bottomStyle === 'shorts';
    parts.skirtGrp.visible = s.bottomStyle === 'skirt';
    parts.maxiGrp.visible = s.bottomStyle === 'skirt_long';

    parts.shoeSneakers.visible = s.shoeStyle === 'sneakers';
    parts.shoeBoots.visible = s.shoeStyle === 'boots';
    parts.shoeLoafers.visible = s.shoeStyle === 'loafers';
    parts.shoeHeels.visible = s.shoeStyle === 'heels';
    parts.shoeSandals.visible = s.shoeStyle === 'sandals';

    parts.bagBackpack.visible = s.bag === 'backpack';
    parts.bagTote.visible = s.bag === 'tote';
    parts.bagCrossbody.visible = s.bag === 'crossbody';
  }, [state]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'none' }} />
  );
}

// ─── UI COMPONENTS ───────────────────────────────────────

const INJECT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
  :root {
    --ink:#0a0a0f; --inkL:#111827; --inkM:#1a2035;
    --gold:#8494FF; --goldL:#C9BEFF; --goldP:rgba(132, 148, 255, 0.08); /* Updated to new gold */
    --goldB:rgba(132, 148, 255, 0.22); --cream:#FFDBFD;
    --creamM:rgba(255, 219, 253, 0.55); --creamD:rgba(255, 219, 253, 0.28);
    --gl:rgba(255,255,255,0.04); --glB:rgba(255,255,255,0.09);
    --glBH:rgba(255,255,255,0.17);
  }
  .ac-wrap { font-family:'DM Sans',sans-serif; background:var(--ink); color:var(--cream); height:100vh; display:flex; overflow:hidden; padding-top: 80px; position: relative; }
  .ac-canvas { flex:1; position:relative; background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(132, 148, 255, 0.1) 0%,transparent 70%),var(--ink); border-right: 1px solid var(--glB); }
  .ac-canvas-hint { position:absolute; bottom:24px; left:50%; transform:translateX(-50%); font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--creamD); white-space:nowrap; border:1px solid var(--glB); padding:8px 18px; backdrop-filter:blur(8px); background:rgba(7, 7, 20, 0.5); cursor: none;}
  .ac-panel { width:420px; display:flex; flex-direction:column; background:rgba(7, 7, 20, 0.97); z-index:10; }
  .ac-header { padding:28px 28px 22px; border-bottom:1px solid var(--glB); flex-shrink:0; }
  .ac-logo { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; letter-spacing:8px; color:var(--cream); margin-bottom:6px; }
  .ac-logo span { color:var(--gold); }
  .ac-subtitle { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--creamD); }
  .ac-tabs { display:flex; border-bottom:1px solid var(--glB); flex-shrink:0; }
  .ac-tab { flex:1; font-family:'Space Mono',monospace; font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--creamD); padding:14px 4px; background:none; border:none; cursor:none; transition:all .25s; border-bottom:2px solid transparent; position:relative; bottom:-1px; }
  .ac-tab.active { color:var(--gold); border-bottom-color:var(--gold); }
  .ac-tab:hover:not(.active) { color:var(--cream); }
  .ac-scroll { flex:1; overflow-y:auto; padding:24px 24px 100px; }
  .ac-scroll::-webkit-scrollbar { width:3px; }
  .ac-scroll::-webkit-scrollbar-track { background:transparent; }
  .ac-scroll::-webkit-scrollbar-thumb { background:rgba(132, 148, 255, 0.2); border-radius:2px; }
  .ac-section { margin-bottom:28px; }
  .ac-section-label { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .ac-section-label::after { content:''; flex:1; height:1px; background:var(--glB); }
  .ac-swatch-row { display:flex; flex-wrap:wrap; gap:8px; }
  .ac-swatch { width:34px; height:34px; border-radius:50%; border:2px solid transparent; cursor:none; transition:all .2s; position:relative; }
  .ac-swatch.active { border-color:var(--gold); transform:scale(1.12); }
  .ac-swatch:hover:not(.active) { transform:scale(1.08); border-color:var(--glBH); }
  .ac-swatch-inner { position:absolute; inset:3px; border-radius:50%; }
  .ac-chip-row { display:flex; flex-wrap:wrap; gap:8px; }
  .ac-chip { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; padding:8px 14px; background:var(--gl); border:1px solid var(--glB); color:var(--creamM); cursor:none; transition:all .2s; white-space:nowrap; clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%); }
  .ac-chip.active { background:var(--goldP); border-color:var(--goldB); color:var(--gold); }
  .ac-chip:hover:not(.active) { border-color:var(--glBH); color:var(--cream); }
  .ac-gender-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .ac-gender-btn { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:14px; background:var(--gl); border:1px solid var(--glB); color:var(--creamM); cursor:none; transition:all .2s; text-align:center; }
  .ac-gender-btn.active { background:var(--goldP); border-color:var(--goldB); color:var(--gold); }
  .ac-gender-btn:hover:not(.active) { border-color:var(--glBH); color:var(--cream); }
  .ac-footer { padding:18px 24px; border-top:1px solid var(--glB); display:flex; flex-direction:column; gap:10px; flex-shrink:0; background:rgba(7, 7, 20, 0.99); }
  .ac-cta { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:16px; background:var(--gold); color:var(--ink); border:none; cursor:none; transition:all .3s; clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%); }
  .ac-cta:hover { background:var(--goldL); transform:translateY(-2px); box-shadow: 0 10px 20px rgba(132,148,255,0.2)}
  .ac-cta-ghost { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:14px; background:transparent; color:var(--creamM); border:1px solid var(--glB); cursor:none; transition:all .3s; }
  .ac-cta-ghost:hover { border-color:var(--goldB); color:var(--gold); }
  .ac-color-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; }
  .ac-color-tile { padding:10px 6px; background:var(--gl); border:1px solid var(--glB); cursor:none; transition:all .2s; text-align:center; }
  .ac-color-tile.active { border-color:var(--goldB); background:var(--goldP); }
  .ac-color-tile:hover:not(.active) { border-color:var(--glBH); }
  .ac-color-dot { width:20px; height:20px; border-radius:50%; margin:0 auto 5px; border:1px solid rgba(255,255,255,0.12); }
  .ac-color-name { font-family:'Space Mono',monospace; font-size:7px; letter-spacing:1px; text-transform:uppercase; color:var(--creamD); }
  .ac-color-tile.active .ac-color-name { color:var(--gold); }
  .ac-divider { height:1px; background:var(--glB); margin:6px 0 18px; }
  .ac-subsection { font-family:'Space Mono',monospace; font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--creamD); margin-bottom:10px; margin-top:4px; }
`;

const TABS = ['Silhouette', 'Tops', 'Bottoms', 'Shoes', 'Accessories', 'How it Works'];

function ColorGrid({ palette, active, onChange }) {
  return (
    <div className="ac-color-grid">
      {Object.entries(palette).map(([key, { hex, label }]) => (
        <div
          key={key}
          className={`ac-color-tile${active === key ? ' active' : ''}`}
          onClick={() => onChange(key)}
        >
          <div className="ac-color-dot" style={{ background: hex }} />
          <div className="ac-color-name">{label}</div>
        </div>
      ))}
    </div>
  );
}

function ChipRow({ options, active, onChange }) {
  return (
    <div className="ac-chip-row">
      {options.map(({ id, label }) => (
        <div
          key={id}
          className={`ac-chip${active === id ? ' active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────
export default function AvatarCustomizer() {
  const [state, setState] = useState({
    gender: 'male',
    skin: 'ivory',
    hair: 'raven',
    topStyle: 'tee',
    topColor: 'chalk',
    bottomStyle: 'jeans',
    bottomColor: 'denim',
    shoeStyle: 'sneakers',
    shoeColor: 'obsidian',
    eyewear: 'none',
    hat: 'none',
    earrings: 'none',
    watch: 'none',
    necklace: 'none',
    bag: 'none',
  });

  const [tab, setTab] = useState('Silhouette');

  const set = (key, val) => setState(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    const id = 'ac-styles';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id; el.textContent = INJECT_CSS;
      document.head.appendChild(el);
    }
    return () => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  return (
    <div className="animate-fade-in" style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div className="ac-wrap">
        {/* 3D Canvas */}
        <div className="ac-canvas">
          <ThreeCanvas state={state} />
          <div className="ac-canvas-hint">Drag to orbit · Auto-rotates</div>
        </div>

        {/* Side Panel */}
        <div className="ac-panel">
          <div className="ac-header">
            <div className="ac-logo">ARY<span>A</span>Ā</div>
            <div className="ac-subtitle">Virtual Wardrobe Sandbox</div>
          </div>

          <div className="ac-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`ac-tab${tab === t ? ' active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="ac-scroll">
            {tab === 'Silhouette' && (
              <>
                <div className="ac-section">
                  <div className="ac-section-label">Body Form</div>
                  <div className="ac-gender-row">
                    <button className={`ac-gender-btn${state.gender === 'male' ? ' active' : ''}`} onClick={() => set('gender', 'male')}>Masculine</button>
                    <button className={`ac-gender-btn${state.gender === 'female' ? ' active' : ''}`} onClick={() => set('gender', 'female')}>Feminine</button>
                  </div>
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Skin Tone</div>
                  <ColorGrid palette={PALETTE.skin} active={state.skin} onChange={v => set('skin', v)} />
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Hair Colour</div>
                  <ColorGrid palette={PALETTE.hair} active={state.hair} onChange={v => set('hair', v)} />
                </div>
              </>
            )}

            {tab === 'Tops' && (
              <>
                <div className="ac-section">
                  <div className="ac-section-label">Style</div>
                  <ChipRow options={STYLES.tops} active={state.topStyle} onChange={v => set('topStyle', v)} />
                </div>
                <div className="ac-section">
                  <div className="ac-section-label">Colour</div>
                  <ColorGrid palette={PALETTE.tops} active={state.topColor} onChange={v => set('topColor', v)} />
                </div>
              </>
            )}

            {tab === 'Bottoms' && (
              <>
                <div className="ac-section">
                  <div className="ac-section-label">Style</div>
                  <ChipRow options={STYLES.bottoms} active={state.bottomStyle} onChange={v => set('bottomStyle', v)} />
                </div>
                <div className="ac-section">
                  <div className="ac-section-label">Colour</div>
                  <ColorGrid palette={PALETTE.bottoms} active={state.bottomColor} onChange={v => set('bottomColor', v)} />
                </div>
              </>
            )}

            {tab === 'Shoes' && (
              <>
                <div className="ac-section">
                  <div className="ac-section-label">Style</div>
                  <ChipRow options={STYLES.shoes} active={state.shoeStyle} onChange={v => set('shoeStyle', v)} />
                </div>
                <div className="ac-section">
                  <div className="ac-section-label">Colour</div>
                  <ColorGrid palette={PALETTE.shoes} active={state.shoeColor} onChange={v => set('shoeColor', v)} />
                </div>
              </>
            )}

            {tab === 'Accessories' && (
              <>
                <div className="ac-section">
                  <div className="ac-section-label">Eyewear</div>
                  <ChipRow options={STYLES.eyewear} active={state.eyewear} onChange={v => set('eyewear', v)} />
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Headwear</div>
                  <ChipRow options={STYLES.hats} active={state.hat} onChange={v => set('hat', v)} />
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Wristwear</div>
                  <ChipRow options={STYLES.watches} active={state.watch} onChange={v => set('watch', v)} />
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Earrings</div>
                  <ChipRow options={STYLES.earrings} active={state.earrings} onChange={v => set('earrings', v)} />
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Necklace</div>
                  <ChipRow options={STYLES.necklaces} active={state.necklace} onChange={v => set('necklace', v)} />
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Bag</div>
                  <ChipRow options={STYLES.bags} active={state.bag} onChange={v => set('bag', v)} />
                </div>
              </>
            )}

            {tab === 'How it Works' && (
              <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
                <div className="ac-section">
                  <div className="ac-section-label">Engine Overview</div>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--creamM)', marginBottom: '16px' }}>
                    The ARYAĀ Sandbox demonstrates our real-time 3D configuration engine. It uses a custom-built Three.js pipeline to render parametric product models.
                  </p>
                </div>
                
                <div className="ac-section">
                  <div className="ac-section-label">Core Technologies</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'var(--gl)', border: '1px solid var(--glB)', padding: '12px' }}>
                      <div style={{ fontFamily: 'Space Mono', monospace: 'true', fontSize: '10px', color: 'var(--gold)', marginBottom: '4px', textTransform: 'uppercase' }}>Media Pipe AI</div>
                      <p style={{ fontSize: '11px', color: 'var(--creamD)' }}>Performs 468-point face mesh tracking and body landmark detection in WASM at 60fps.</p>
                    </div>
                    <div style={{ background: 'var(--gl)', border: '1px solid var(--glB)', padding: '12px' }}>
                      <div style={{ fontFamily: 'Space Mono', monospace: 'true', fontSize: '10px', color: 'var(--gold)', marginBottom: '4px', textTransform: 'uppercase' }}>Three.js Engine</div>
                      <p style={{ fontSize: '11px', color: 'var(--creamD)' }}>Manages the WebGL scene, lighting, and real-time mesh deformation for virtual try-on.</p>
                    </div>
                    <div style={{ background: 'var(--gl)', border: '1px solid var(--glB)', padding: '12px' }}>
                      <div style={{ fontFamily: 'Space Mono', monospace: 'true', fontSize: '10px', color: 'var(--gold)', marginBottom: '4px', textTransform: 'uppercase' }}>Vite Next Gen</div>
                      <p style={{ fontSize: '11px', color: 'var(--creamD)' }}>State management and layout optimized for zero-latency UI updates in the browser.</p>
                    </div>
                  </div>
                </div>

                <div className="ac-section">
                  <div className="ac-section-label">Pipeline Workflow</div>
                  <div style={{ fontSize: '11px', color: 'var(--creamM)', paddingLeft: '12px', borderLeft: '1px solid var(--goldB)' }}>
                    <div style={{ marginBottom: '12px' }}><span style={{ color: 'var(--gold)', fontFamily: 'Space Mono' }}>01.</span> Stream frames from camera/video source</div>
                    <div style={{ marginBottom: '12px' }}><span style={{ color: 'var(--gold)', fontFamily: 'Space Mono' }}>02.</span> Detect skeletal keypoints via ML inference</div>
                    <div style={{ marginBottom: '12px' }}><span style={{ color: 'var(--gold)', fontFamily: 'Space Mono' }}>03.</span> Project 3D geometry onto detected landmarks</div>
                    <div style={{ marginBottom: '12px' }}><span style={{ color: 'var(--gold)', fontFamily: 'Space Mono' }}>04.</span> Apply PBR materials and environmental lighting</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ac-footer">
            <button className="ac-cta">View Next Generation Models</button>
            <button className="ac-cta-ghost">View in Source Code</button>
          </div>
        </div>
      </div>
    </div>
  );
}
