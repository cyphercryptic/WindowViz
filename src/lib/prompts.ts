import type {
  Product,
  Perspective,
  WindowAttributes,
  SlidingDoorAttributes,
  EntryDoorAttributes,
} from '@/types';
import { FRAME_COLORS } from '@/lib/frame-colors';

interface PromptOptions {
  perspective: Perspective;
}

// ---------------------------------------------------------------------------
// Color resolution — translate brand color names to physical descriptions
// the AI can understand (e.g. "Terratone" → "warm earthy brown")
// ---------------------------------------------------------------------------

function resolveColor(colorName: string): string {
  const key = colorName.toLowerCase().trim();

  // Direct match in our frame colors database
  if (FRAME_COLORS[key]) {
    return describeHexColor(key, FRAME_COLORS[key].hex);
  }

  // Partial match
  for (const [k, v] of Object.entries(FRAME_COLORS)) {
    if (key.includes(k) || k.includes(key)) {
      return describeHexColor(k, v.hex);
    }
  }

  // Common brand color names the AI might not know
  const brandColorMap: Record<string, string> = {
    'terratone': 'warm earthy brown (similar to terra cotta brown, a medium brown with warm reddish-brown undertones)',
    'sandtone': 'medium warm tan-beige, VISIBLY different from white (a distinct golden-tan color like wet beach sand or manila-folder tan — NOT white, NOT off-white, NOT cream)',
    'sandstone': 'medium warm tan-beige, VISIBLY different from white (a distinct tan-beige like natural sandstone rock — NOT white, NOT off-white)',
    'canvas': 'warm creamy off-white with obvious beige/tan undertones, VISIBLY warmer than pure white (like unbleached canvas fabric — noticeably yellow-tinted against white trim)',
    'cocoa bean': 'deep dark chocolate brown',
    'hartford green': 'deep forest green (a dark, rich hunter green)',
    'forest green': 'deep forest green (a rich, dark green like evergreen trees)',
    'red rock': 'warm reddish-brown (like Arizona red rock / desert clay, a rich burnt sienna)',
    'driftwood': 'weathered gray-brown (a soft, muted grayish-tan like sun-bleached wood)',
    'prairie grass': 'warm golden-tan (a soft earthy khaki-gold, like dried prairie grass)',
    'sage': 'muted sage green (a soft, dusty grayish-green)',
    'boysenberry': 'deep plum purple-red (a rich, dark berry color)',
    'ebony': 'very dark near-black (a rich, deep charcoal-black)',
    'iron ore': 'dark charcoal gray (almost black but with a metallic gray tone)',
    'silver cloud': 'light silver gray',
    'desert sand': 'warm tan (a medium beige with golden undertones)',
    'putty': 'warm grayish-beige (a muted khaki tone)',
    'wicker': 'warm medium tan (like woven wicker furniture)',
    'sierra': 'medium warm brown (a rich tawny brown like desert clay)',
    'dark walnut': 'very dark brown (rich espresso brown, almost black)',
    'cranberry': 'deep rich red (a dark, sophisticated burgundy-red)',
    'midnight blue': 'very dark navy blue (almost black with blue undertones)',
  };

  if (brandColorMap[key]) {
    return brandColorMap[key];
  }

  // If it's already a common color word the AI will understand, use it directly
  const commonColors = ['white', 'black', 'brown', 'tan', 'beige', 'gray', 'grey', 'red', 'blue', 'green', 'bronze', 'almond', 'ivory', 'cream', 'mahogany', 'natural wood'];
  for (const cc of commonColors) {
    if (key.includes(cc)) return colorName;
  }

  // Fallback: just use the name and hope for the best
  return colorName;
}

function describeHexColor(name: string, hex: string): string {
  // Convert known frame color keys to natural language descriptions
  const descriptions: Record<string, string> = {
    'white': 'clean bright white',
    'canvas': 'soft warm off-white (creamy, like an artist\'s canvas)',
    'almond': 'soft almond/ivory (a warm off-white with a slight yellowish-cream tone)',
    'putty': 'warm putty beige (a muted grayish-tan)',
    'tan': 'warm tan',
    'sandstone': 'medium warm tan-beige, VISIBLY different from white (like natural sandstone rock — NOT white, NOT off-white)',
    'desert sand': 'warm sandy tan',
    'sandtone': 'medium warm tan-beige, VISIBLY different from white (a distinct golden-tan color like wet beach sand — NOT white)',
    'wicker': 'warm medium tan-brown',
    'silver cloud': 'light silver gray',
    'iron ore': 'dark charcoal gray',
    'sierra': 'medium warm brown (tawny, clay-like)',
    'terratone': 'warm earthy brown (medium brown with reddish-brown undertones, like terra cotta)',
    'bronze': 'rich dark bronze brown',
    'dark bronze': 'deep dark bronze (very dark brown with metallic undertones)',
    'cocoa bean': 'deep dark chocolate brown',
    'dark walnut': 'very dark espresso brown',
    'mahogany': 'rich dark reddish-brown mahogany',
    'natural wood': 'natural warm wood tone (honey-amber)',
    'black': 'matte black',
    'hartford green': 'deep forest green',
    'forest green': 'deep forest green (rich dark green like evergreen trees)',
    'cranberry': 'deep rich cranberry red',
    'red rock': 'warm reddish-brown (like Arizona red rock, burnt sienna)',
    'midnight blue': 'very dark navy blue',
  };

  return descriptions[name] || name;
}

// ---------------------------------------------------------------------------
// Material description — translate material codes to natural language
// ---------------------------------------------------------------------------

function describeMaterial(material: string): string {
  const materialMap: Record<string, string> = {
    'fibrex': 'composite (a smooth, solid, painted composite material)',
    'clad-wood': 'aluminum-clad wood (wood interior with painted aluminum exterior cladding)',
    'vinyl': 'vinyl',
    'fiberglass': 'fiberglass',
    'aluminum': 'aluminum',
    'wood': 'wood',
    'composite': 'composite',
    'steel': 'steel',
  };
  return materialMap[material.toLowerCase()] || material;
}

// ---------------------------------------------------------------------------
// Physical description helpers — tell the AI what the product LOOKS LIKE,
// not just the brand name (the AI doesn't know specific manufacturer products)
// ---------------------------------------------------------------------------

function describeWindowPhysically(product: Product, attrs: WindowAttributes): string {
  const type = attrs.windowType || 'double-hung';
  const material = describeMaterial(product.material || 'vinyl');
  const color = resolveColor(product.color);

  // IMPORTANT: "frame and sashes" refers specifically to the parts of the window immediately surrounding the glass
  // (the operable window unit itself). The exterior trim / casing / brickmould / surround around the window opening
  // is a SEPARATE element and must remain its existing color (typically white).
  const frameSpec = `The window unit itself — the frame and sashes (the parts of the window directly surrounding and touching the glass) — is made of ${material} and painted ${color}. (The exterior trim, casing, or brickmould AROUND the window opening is a separate element and must remain its original color, typically white — do NOT paint the trim ${color}.)`;

  const typeDescriptions: Record<string, string> = {
    'double-hung': `a true DOUBLE-HUNG window. A double-hung window has TWO stacked sashes (an upper sash and a lower sash) that both slide vertically up and down. There is a visible horizontal meeting rail in the middle of the window where the two sashes meet — this horizontal divider splitting the window into an upper pane and a lower pane is the defining feature of a double-hung. ${frameSpec}`,
    'casement': `a true CASEMENT window that swings outward on hinges from one vertical side, like a door. It is a single tall sash with a single unbroken glass pane (no horizontal meeting rail). It has a visible crank handle at the bottom interior. ${frameSpec}`,
    'bay': `a bay window that projects outward from the wall, creating a wide panoramic view. It has a large center fixed pane flanked by two angled side windows. ${frameSpec}`,
    'bow': `a bow window that curves gracefully outward from the wall in a smooth arc, made up of 4-5 equal-sized window panels. ${frameSpec}`,
    'picture': `a large fixed PICTURE window — one single, uninterrupted pane of glass with no opening mechanism, no sashes, no meeting rails, no dividers. ${frameSpec} The frame profile is clean and minimal to maximize the glass area.`,
    'awning': `an AWNING window that hinges at the top and swings outward from the bottom. It is a single sash with a single glass pane, wider than it is tall. ${frameSpec}`,
    'sliding': `a horizontal SLIDING window where one or both sashes slide left and right along a track. It has a vertical meeting rail (not horizontal) dividing the left and right sashes. ${frameSpec}`,
    'hopper': `a HOPPER window that hinges at the bottom and tilts inward from the top. It is a compact single sash. ${frameSpec}`,
    'garden': `a GARDEN window that projects outward like a small greenhouse box, with glass on the top, front, and sides. ${frameSpec}`,
    'egress': `a large EGRESS window designed as an emergency exit, with a wide opening. ${frameSpec}`,
  };

  return typeDescriptions[type] || `a ${type} window. ${frameSpec}`;
}

function describeSlidingDoorPhysically(product: Product, attrs: SlidingDoorAttributes): string {
  const config = attrs.configuration || '2-panel';
  const material = describeMaterial(product.material || 'vinyl');
  const color = resolveColor(product.color);
  const layout = attrs.panelLayout || 'OX';

  const configDescriptions: Record<string, string> = {
    '2-panel': `a wide, floor-to-ceiling 2-panel sliding glass patio door. It has one large fixed glass panel and one that slides horizontally on a track. The frame is sleek ${material} in ${color} with thin, modern profiles that maximize the glass area.`,
    '3-panel': `an extra-wide, floor-to-ceiling 3-panel sliding glass patio door. It has three tall glass panels — one or two slide on tracks while the others are fixed. The frame is ${material} in ${color} with thin profiles for maximum glass and light.`,
    '4-panel': `a grand, extra-wide 4-panel sliding glass patio door spanning a large wall opening. It has four tall floor-to-ceiling glass panels that slide on tracks. The frame is ${material} in ${color} with slim, modern profiles.`,
    'pocket': `a pocket sliding glass door where the panels slide completely into the wall cavity, creating a seamless indoor-outdoor opening. The frame is ${material} in ${color}.`,
    'stacking': `a multi-panel stacking sliding glass door where all panels slide and stack to one side, creating a wide open-air connection. The frame is ${material} in ${color}.`,
  };

  return configDescriptions[config] || `a ${config} sliding glass patio door with a ${material} frame in ${color}. It has large floor-to-ceiling glass panels that slide on a track.`;
}

function describeEntryDoorPhysically(product: Product, attrs: EntryDoorAttributes): string {
  const style = attrs.doorStyle || 'panel';
  const material = describeMaterial(product.material || 'fiberglass');
  const color = resolveColor(product.color);
  const panels = attrs.panelCount || 6;

  const styleDescriptions: Record<string, string> = {
    'panel': `a classic ${panels}-panel ${material} entry door in ${color}. It has raised rectangular panels with detailed molding profiles creating depth and shadow lines. The surface has a smooth, premium finish.`,
    'craftsman': `a Craftsman-style ${material} entry door in ${color}. It features a distinctive flat panel design with clean horizontal lines, typically with a large bottom panel and smaller upper panels. The look is artisan and handcrafted.`,
    'modern': `a sleek, modern ${material} entry door in ${color}. It has a flat, minimalist surface with clean geometric lines — possibly with narrow vertical or horizontal grooves. The design is contemporary and bold.`,
    'traditional': `a traditional ${material} entry door in ${color} with elegant raised panels and decorative molding. It has a classic, timeless look with refined proportions.`,
    'rustic': `a rustic ${material} entry door in ${color} with a rich woodgrain texture, iron-look hardware accents, and a handcrafted appearance. It looks solid and substantial.`,
    'farmhouse': `a farmhouse-style ${material} entry door in ${color}. It has a charming, inviting design — possibly with cross-buck panels or a window in the upper portion. The look is warm and welcoming.`,
    'contemporary': `a contemporary ${material} entry door in ${color} with bold, architectural lines. It features asymmetric panels or geometric cutouts for a striking, high-design look.`,
  };

  let desc = styleDescriptions[style] || `a ${style}-style ${material} entry door in ${color}.`;

  // Add glass description
  if (attrs.glassType && attrs.glassType !== 'none') {
    const glassDescriptions: Record<string, string> = {
      'full-light': 'The door has a full-length glass insert from top to bottom, flooding the entryway with light.',
      'half-light': 'The upper half of the door has a glass insert, with solid panels below.',
      'quarter-light': 'The door has a small glass window in the upper quarter.',
      'sidelight': 'The door is flanked by narrow glass sidelight panels.',
      'transom': 'Above the door is a horizontal transom window.',
      'decorative': 'The door features decorative glass inserts with ornamental patterns.',
    };
    desc += ' ' + (glassDescriptions[attrs.glassType] || `The door includes ${attrs.glassType} glass.`);
    if (attrs.glassPattern && attrs.glassPattern !== 'clear') {
      desc += ` The glass has a ${attrs.glassPattern} pattern.`;
    }
  }

  // Add sidelights
  if (attrs.sidelightConfig && attrs.sidelightConfig !== 'none') {
    const sideDesc = attrs.sidelightConfig === 'both'
      ? 'tall, narrow glass sidelight panels on both sides of the door'
      : `a tall, narrow glass sidelight panel on the ${attrs.sidelightConfig} side of the door`;
    desc += ` There are ${sideDesc}, adding elegance and light.`;
  }

  // Add transom
  if (attrs.transomType && attrs.transomType !== 'none') {
    desc += ` Above the door is a ${attrs.transomType} transom window.`;
  }

  return desc;
}

function describeHardware(attrs: EntryDoorAttributes): string {
  const parts: string[] = [];
  if (attrs.handleSet) {
    const handleDescriptions: Record<string, string> = {
      'lever': 'a sleek lever handle',
      'knob': 'a round door knob',
      'handleset': 'a full handleset with thumb latch and deadbolt',
      'pull-bar': 'a long modern pull bar handle',
    };
    parts.push(handleDescriptions[attrs.handleSet] || `a ${attrs.handleSet} handle`);
  }
  if (attrs.handleFinish) parts.push(`in ${attrs.handleFinish} finish`);
  if (attrs.kickplate) parts.push('with a decorative kick plate at the bottom');
  return parts.length > 0 ? `Hardware: ${parts.join(' ')}.` : '';
}

// ---------------------------------------------------------------------------
// Windows
// ---------------------------------------------------------------------------

export function buildWindowPrompt(product: Product, options: PromptOptions): string {
  const attrs = product.attributes as WindowAttributes;
  const isExterior = options.perspective === 'exterior';

  const windowTypeName = (attrs.windowType || 'double-hung').replace(/-/g, ' ');
  const resolvedColor = resolveColor(product.color);
  const hasGrids = Boolean(attrs.gridPattern && attrs.gridPattern !== 'none');

  const styleDetails: Record<string, string> = {
    'double-hung': 'Double-hung: two stacked vertical sashes, a horizontal meeting rail dividing upper and lower panes of equal size.',
    'casement': 'Casement: a single tall sash with one unbroken glass pane, hinges on one vertical side, visible crank handle.',
    'picture': 'Picture: one single fixed pane, no sashes, no dividers.',
    'awning': 'Awning: a single sash wider than tall, hinged at the top.',
    'sliding': 'Sliding: two sashes side by side with a vertical meeting rail, slides horizontally.',
    'bay': 'Bay window: a flat center window flanked by two angled side windows projecting outward.',
    'bow': 'Bow window: 4–5 equal panels curving outward in a smooth arc.',
    'hopper': 'Hopper: single compact sash hinged at the bottom, tilts inward.',
  };
  const styleDetail = styleDetails[attrs.windowType || 'double-hung'] || `A ${windowTypeName} window.`;

  let gridLine = '';
  if (hasGrids) {
    const gridDescriptions: Record<string, string> = {
      'colonial': 'Colonial-style grid pattern — small rectangular panes arranged in a classic grid across the glass.',
      'prairie': 'Prairie-style grilles framing just the outer edges of the glass.',
      'diamond': 'Diamond-pattern grilles creating an elegant lattice.',
    };
    gridLine = gridDescriptions[attrs.gridPattern!] || `${attrs.gridPattern} grille pattern on the glass.`;
  }

  // Strip the parenthetical "(like X)" clutter from the color description — one clean color phrase
  const cleanColor = resolvedColor.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const colorLabel = product.color; // e.g. "Red Rock"

  return [
    `Generate a photorealistic version of this ${isExterior ? 'exterior' : 'interior'} house photo showing brand-new ${windowTypeName.toUpperCase()} replacement windows installed in place of the existing ones.`,
    ``,
    `THE NEW WINDOWS (what changes):`,
    `• Style: ${styleDetail}`,
    `• Color: ${cleanColor} (${colorLabel}). ONLY the window unit itself gets this color — specifically the sashes, the frame members directly touching the glass, and any mullions/meeting rails between glass panes. The new window color must be VISUALLY OBVIOUS at a glance — if someone glanced at the house, they would immediately see the window units are ${colorLabel}, clearly distinct from the white trim surrounding them. Do not leave the windows looking white or near-white — they must look visibly and unmistakably ${colorLabel}.`,
    hasGrids
      ? `• Glass: ${gridLine} This EXACT SAME grid pattern applies UNIFORMLY to EVERY window in the photo — if there are three windows, all three get identical grids in identical positions; if one is a picture window and another is a double-hung, both still get the same grid pattern on their glass. No window in the photo should have a different grid pattern from the others.`
      : `• Glass: Clear single pane per sash. No grids, no muntins, no dividers. This applies UNIFORMLY to EVERY window in the photo — no window should have grids, even if the original photo showed grids on some windows.`,
    ``,
    `WHAT MUST NOT CHANGE COLOR (critical — do not paint ${cleanColor}):`,
    isExterior
      ? `• The exterior TRIM, CASING, and BRICKMOULD around the window opening — the flat boards framing the outside of the window unit — stay their ORIGINAL color (almost always white or matching the house). The trim and the window unit are TWO SEPARATE ELEMENTS; only the window unit gets the new color.`
      : `• The interior JAMB, CASING, STOOL, and APRON around the window — all the painted wood trim framing the window opening from the inside — stay their ORIGINAL color (almost always white). The trim and the window unit are TWO SEPARATE ELEMENTS; only the window unit itself (sash + frame members directly against the glass) gets the new color.`,
    isExterior
      ? `• Siding, brick, stucco, or any wall material touching the trim stays original.`
      : `• The room's walls, drywall, paint, and wallpaper stay original.`,
    ``,
    `UNCHANGED FROM SOURCE:`,
    `• The ${isExterior ? 'house exterior (siding, roof, doors, landscaping)' : 'room itself (walls, floor, ceiling, furniture, view out the window)'} stays unchanged.`,
    `• Same number of windows in the same positions and sizes.`,
    ``,
    `FINAL IMAGE: Photorealistic, magazine quality. ${isExterior
      ? 'Clean exterior shot with appealing sky and vibrant but natural colors.'
      : `The new window sashes and frame members must be VISIBLY ${colorLabel} — look directly at the window frame and confirm it reads clearly as ${cleanColor}, not white. Gently lift the room's shadows so walls, floor, and furniture are clearly visible (soft HDR-style balance), but keep this subtle — the brightening must NOT wash out or desaturate the ${colorLabel} frame color. The colored frame is the hero of this image; exposure tuning is secondary and supports it.`
    }`,
  ].filter(Boolean).join('\n');
}

// ---------------------------------------------------------------------------
// Sliding Glass Doors
// ---------------------------------------------------------------------------

export function buildSlidingDoorPrompt(product: Product, options: PromptOptions): string {
  const attrs = product.attributes as SlidingDoorAttributes;
  const isExterior = options.perspective === 'exterior';

  const config = attrs.configuration || '2-panel';
  const layout = attrs.panelLayout || 'OX';
  const resolvedColor = resolveColor(product.color);
  const cleanColor = resolvedColor.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const colorLabel = product.color;

  const configDetails: Record<string, string> = {
    '2-panel': `${config} sliding glass patio door — one fixed glass panel and one operable sliding panel on a horizontal track (panel layout: ${layout}).`,
    '3-panel': `${config} sliding glass patio door — three full-height glass panels side by side, at least one sliding on a track (panel layout: ${layout}).`,
    '4-panel': `${config} sliding glass patio door — four full-height glass panels spanning a wide opening, two center panels slide on tracks (panel layout: ${layout}).`,
    'pocket': `pocket sliding glass door — panels slide entirely into the wall cavity for a frameless opening.`,
    'stacking': `multi-slide stacking glass door — multiple panels slide and stack to one side.`,
  };
  const configDetail = configDetails[config] || `${config} sliding glass patio door.`;

  const hasGrids = Boolean(attrs.gridPattern && attrs.gridPattern !== 'none');
  const handleLine = (attrs.handleStyle || attrs.handleColor)
    ? `${attrs.handleStyle || 'modern'} handle${attrs.handleColor ? ` in ${attrs.handleColor}` : ''}.`
    : '';

  return [
    `Generate a photorealistic version of this ${isExterior ? 'exterior' : 'interior'} photo showing a brand-new SLIDING GLASS PATIO DOOR installed in place of the existing door or wall section.`,
    ``,
    `THE NEW DOOR (what changes):`,
    `• Style: ${configDetail}`,
    `• Color: ${cleanColor} (${colorLabel}). ONLY the door unit itself gets this color — specifically the vertical stiles, horizontal rails, and any mullions between glass panels. The new door color must be VISUALLY OBVIOUS at a glance — someone glancing at the ${isExterior ? 'house' : 'room'} must immediately see the door frame is ${colorLabel}, clearly distinct from the surrounding trim or wall. Do not leave the door frame looking white or near-white unless ${colorLabel} is white — it must look visibly and unmistakably ${colorLabel}.`,
    `• Glass: Floor-to-ceiling clear tempered glass panels, crystal clear and pristine. ${isExterior ? 'Faint interior of the home visible through the glass.' : 'Outdoor view beautifully visible through the glass with natural light streaming in.'}${hasGrids ? ` Glass has ${attrs.gridPattern} grilles.` : ''}`,
    handleLine ? `• Hardware: ${handleLine}` : '',
    ``,
    `WHAT MUST NOT CHANGE COLOR (critical — do not paint ${cleanColor}):`,
    `• The exterior TRIM, CASING, and BRICKMOULD around the door opening — the flat boards framing the outside of the door unit — stay their ORIGINAL color (almost always white or matching the house). The trim and the door unit are TWO SEPARATE ELEMENTS; only the door unit gets the new color.`,
    `• Siding, brick, stucco, or any wall material touching the trim stays original.`,
    ``,
    `UNCHANGED FROM SOURCE:`,
    `• The ${isExterior ? 'house exterior (siding, roof, ALL other windows and doors, landscaping)' : 'room itself (walls, floor, ceiling, furniture, ALL other windows)'} stays unchanged.`,
    `• The opening size and position stays the same — the new door fits the existing opening.`,
    `• Do not add any new windows or doors that don't already exist.`,
    ``,
    `FINAL IMAGE: Photorealistic, magazine quality. ${isExterior
      ? 'Clean exterior shot with appealing sky and vibrant but natural colors.'
      : 'Brighten the room significantly — lift shadows so walls, floor, ceiling, and furniture are clearly visible. Balance exposure so both the view out the door AND the room interior are well-lit (HDR-style, nothing blown out, nothing too dark).'
    }`,
  ].filter(Boolean).join('\n');
}

// ---------------------------------------------------------------------------
// Entry Doors
// ---------------------------------------------------------------------------

export function buildEntryDoorPrompt(product: Product, options: PromptOptions): string {
  const attrs = product.attributes as EntryDoorAttributes;
  const isExterior = options.perspective === 'exterior';

  const style = attrs.doorStyle || 'panel';
  const panels = attrs.panelCount ?? 6;
  const resolvedColor = resolveColor(product.color);
  const cleanColor = resolvedColor.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const colorLabel = product.color;

  const styleDetails: Record<string, string> = {
    'panel': `${panels}-panel ${style === 'panel' ? 'traditional' : style} entry door with raised rectangular panels and detailed molding profiles creating depth and shadow lines.`,
    'craftsman': `Craftsman-style entry door with flat recessed panels, clean horizontal lines, and an artisan handcrafted feel (typically one large bottom panel and smaller upper panels).`,
    'modern': `modern flush entry door with a clean flat surface, no embossed panels, and minimalist contemporary lines.`,
    'traditional': `traditional entry door with elegant raised panels and classic decorative molding profiles.`,
    'rustic': `rustic entry door with rich woodgrain texture and handcrafted appearance.`,
    'farmhouse': `farmhouse-style entry door with charming cross-buck panels or upper window, warm and inviting.`,
    'contemporary': `contemporary entry door with bold architectural lines, asymmetric panels, or geometric cutouts.`,
  };
  const styleDetail = styleDetails[style] || `${style}-style entry door.`;

  // Glass inserts
  const glassLines: string[] = [];
  if (attrs.glassType && attrs.glassType !== 'none') {
    const glassDescriptions: Record<string, string> = {
      'full-light': 'full-length glass insert spanning top to bottom of the door',
      'half-light': 'glass insert in the upper half of the door with solid panels below',
      'quarter-light': 'small glass window in the upper quarter of the door',
      'sidelight': 'narrow glass sidelight panels flanking the door',
      'transom': 'horizontal transom window above the door',
      'decorative': 'decorative glass inserts with ornamental patterns',
    };
    const glassDesc = glassDescriptions[attrs.glassType] || `${attrs.glassType} glass insert`;
    const pattern = attrs.glassPattern && attrs.glassPattern !== 'clear' ? ` (${attrs.glassPattern} pattern)` : '';
    glassLines.push(`${glassDesc}${pattern}.`);
  }
  if (attrs.sidelightConfig && attrs.sidelightConfig !== 'none') {
    glassLines.push(
      attrs.sidelightConfig === 'both'
        ? 'Tall narrow glass sidelight panels flank the door on BOTH sides.'
        : `A tall narrow glass sidelight panel flanks the door on the ${attrs.sidelightConfig} side.`
    );
  }
  if (attrs.transomType && attrs.transomType !== 'none') {
    glassLines.push(`A ${attrs.transomType} transom window sits above the door.`);
  }
  const glassLine = glassLines.length ? glassLines.join(' ') : 'No glass — solid door for privacy.';

  // Hardware
  const hardwareBits: string[] = [];
  if (attrs.handleSet) {
    const handleDescriptions: Record<string, string> = {
      'lever': 'sleek lever handle',
      'knob': 'round door knob',
      'handleset': 'full handleset with thumb latch and deadbolt',
      'pull-bar': 'long modern pull-bar handle',
    };
    hardwareBits.push(handleDescriptions[attrs.handleSet] || `${attrs.handleSet} handle`);
  }
  if (attrs.handleFinish) hardwareBits.push(`in ${attrs.handleFinish} finish`);
  const hardwareLine = hardwareBits.length ? `${hardwareBits.join(' ')}.` : '';

  return [
    `Generate a photorealistic version of this ${isExterior ? 'exterior' : 'interior'} photo showing a brand-new ENTRY DOOR installed in place of the existing front door.`,
    ``,
    `THE NEW DOOR (what changes):`,
    `• Style: ${styleDetail}`,
    `• Color: ${cleanColor} (${colorLabel}). ONLY the door slab itself gets this color — not the door frame jamb/trim around it. The new door color must be VISUALLY OBVIOUS at a glance — someone approaching the entry must immediately see the door is ${colorLabel}, clearly distinct from the surrounding trim. Do not leave the door looking white or near-white unless ${colorLabel} is white — it must look visibly and unmistakably ${colorLabel}.`,
    `• Glass: ${glassLine}`,
    hardwareLine ? `• Hardware: ${hardwareLine}` : '',
    ``,
    `WHAT MUST NOT CHANGE COLOR (critical — do not paint ${cleanColor}):`,
    `• The door FRAME JAMB, CASING, and BRICKMOULD around the door opening — the flat boards framing the outside of the door slab — stay their ORIGINAL color (almost always white or matching the house). The trim and the door slab are TWO SEPARATE ELEMENTS; only the door slab gets the new color.`,
    `• Siding, brick, stucco, porch ceiling, or any surface touching the trim stays original.`,
    `• Any sidelight or transom GLASS stays clear/decorative — do not paint ${cleanColor} onto the glass.`,
    ``,
    `UNCHANGED FROM SOURCE:`,
    `• The ${isExterior ? 'house exterior (siding, roof, ALL windows, porch, landscaping)' : 'entryway interior (walls, floors, ceiling, furniture, ALL other windows)'} stays unchanged.`,
    `• The door opening size and position stays the same — the new door fits the existing opening.`,
    `• Do not add any new windows or doors that don't already exist.`,
    ``,
    `FINAL IMAGE: Photorealistic, magazine quality. ${isExterior
      ? 'Clean exterior shot with appealing sky and vibrant but natural colors. The entryway should look inviting and premium.'
      : 'Brighten the entryway significantly — lift shadows so walls, floors, and details are clearly visible. Balance exposure so both any glass/bright areas AND the interior space are well-lit (HDR-style).'
    }`,
  ].filter(Boolean).join('\n');
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export function buildPrompt(product: Product, options: PromptOptions): string {
  switch (product.category) {
    case 'window':
      return buildWindowPrompt(product, options);
    case 'sliding_glass_door':
      return buildSlidingDoorPrompt(product, options);
    case 'entry_door':
      return buildEntryDoorPrompt(product, options);
    default:
      throw new Error(`Unknown product category: ${product.category}`);
  }
}
