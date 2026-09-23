import { Scenario } from '@/types/bounty';
export const scenarios: Scenario[] = [
 { id:'shopping-expiry', category:'SHOPPING', title:'Expiry label verification', question:'Does this product appear to expire in 2027?', context:'A shopping agent found a discounted skincare listing. OCR cannot distinguish 2027 from 2022 on the label.', choices:['Yes','No','Unclear'], outcome:['Yes','Yes','Unclear'], media:'2027 / 2022'},
 { id:'browser-checkout', category:'BROWSER', title:'Checkout confirmation', question:'Does this screen confirm that checkout succeeded?', context:'A browser agent needs a human read of a success state before it risks repeating a purchase.', choices:['Yes','No','Unclear'], outcome:['Yes','Yes','Yes'], media:'ORDER CONFIRMED'},
 { id:'marketing-product-visible', category:'CONTENT', title:'Product visibility', question:'Is the product clearly visible in this video frame?', context:'A marketing agent is checking whether the hero frame makes the product legible on a phone.', choices:['Yes','No','Unclear'], outcome:['Yes','No','Unclear'], media:'PRODUCT FRAME'},
 { id:'marketplace-variant', category:'MONITORING', title:'Variant match', question:'Is this listing the same product variant as the reference?', context:'A marketplace monitor wants to avoid confusing a travel-size listing with the full-size reference.', choices:['Same','Different','Unclear'], outcome:['Same','Same','Different'], media:'256 GB / 128 GB'},
];
export const getScenario = (id: string) => scenarios.find(s => s.id === id);
