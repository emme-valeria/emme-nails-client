import { Image, type ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';
import { StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

cssInterop(Image, { className: 'style' });

type OptimizedImageProps = Omit<ImageProps, 'source' | 'placeholder'> & {
  source: ImageProps['source'];
  className?: string;
  containerClassName?: string;
  blurhash?: string;
  fill?: boolean;
  style?: StyleProp<ImageStyle>;
};

export function OptimizedImage({
  source,
  className,
  containerClassName,
  blurhash,
  fill = false,
  contentFit = 'cover',
  transition = 250,
  style,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      source={source}
      placeholder={blurhash ? { blurhash } : undefined}
      contentFit={contentFit}
      transition={transition}
      className={className}
      style={fill ? [StyleSheet.absoluteFill, style] : style}
    />
  );
}
