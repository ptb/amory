/* eslint-disable max-len */

export default (property) => {
  const regex = /(?:((?:boxSizing|textAlignLast))|((?:tabSize))|((?:imageRendering|overscrollBehavior|textSpacing))|((?:object(?:Fit|Position)))|((?:align(?:Content|Items|Self)|animation(?:Delay|Direction|Duration|FillMode|IterationCount|Name|PlayState|TimingFunction)?|back(?:dropFilter|faceVisibility|groundClip)|borderBlock(?:End|Start)|boxDecorationBreak|break(?:After|Before|Inside)|clipPath|colorAdjust|filter|flex(?:Basis|Direction|Flow|Grow|Shrink|Wrap)?|fontKerning|justifyContent|marginBlock(?:End|Start)|mask(?:Border(?:Outset|Repeat|Slice|Source|Width)?(?:Clip|Composite|Image|Origin|Position|Repeat|Size)?)?|order|paddingBlock(?:End|Start)|perspective(?:Origin)?|shape(?:ImageThreshold|Margin|Outside)|text(?:DecorationSkip|Emphasis(?:Color|Position|Style))|transform(?:Origin|Style)?|transition(?:Delay|Duration|Property|TimingFunction)?))|((?:appearance|border(?:Inline(?:End|Start))|column(?:s|Count|Fill|Gap|Rule(?:Color|Style|Width)?|Span|Width)|font(?:FeatureSettings|LanguageOverride|VariantLigatures)|marginInline(?:End|Start)|padding(?:Inline(?:End|Start))|textDecoration(?:Color|Line|Style)?))|((?:hyphens|textSizeAdjust|userSelect))|((?:flow(?:From|Into)|regionFragment|scrollSnap(?:Coordinate|Destination|Points(?:X|Y)|Type)|writingMode))|((?:borderImage)))/

  return property.match (regex)
}
