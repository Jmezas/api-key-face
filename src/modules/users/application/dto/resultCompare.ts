export class ResultCompare {
  Similarity: number;
  Emotions: Emotions[] = [];
}

export class Emotions {
  Type: string;
  Confidence: number;
}
