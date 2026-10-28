import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_BOTTOM_GAP = 12;
const TAB_BAR_CONTENT_GAP = 30;
export const TAB_BAR_CONTENT_CLEARANCE = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_GAP + TAB_BAR_CONTENT_GAP;

/** Extra scroll space keeps the final content clear of the floating tab bar. */
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return insets.bottom + TAB_BAR_CONTENT_CLEARANCE;
}
