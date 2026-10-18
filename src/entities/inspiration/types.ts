export interface InspirationItem {
  id: string;
  title: string;
  styleCategory: 'Minimal' | 'Elegant' | 'Colorful' | 'Romantic' | 'Bold' | 'Seasonal';
  imageUrl: string;
  understoodTags: {
    finish: 'Glossy' | 'Chrome' | 'Cat-eye' | 'Matte' | 'Jelly';
    color: string;
    shape: 'Square' | 'Almond' | 'Oval' | 'Coffin';
    length: 'Short' | 'Medium' | 'Long';
    details: string[];
    complexity: 'Simple' | 'Medium complexity' | 'High complexity';
  };
  baseServiceRecommendation: string;
}
