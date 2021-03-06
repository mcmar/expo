/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "ABI28_0_0RNSVGGroup.h"

@interface ABI28_0_0RNSVGText : ABI28_0_0RNSVGGroup

@property (nonatomic, strong) NSString *textLength;
@property (nonatomic, strong) NSString *baselineShift;
@property (nonatomic, strong) NSString *lengthAdjust;
@property (nonatomic, strong) NSString *alignmentBaseline;
@property (nonatomic, strong) NSArray<NSString *> *deltaX;
@property (nonatomic, strong) NSArray<NSString *> *deltaY;
@property (nonatomic, strong) NSArray<NSString *> *positionX;
@property (nonatomic, strong) NSArray<NSString *> *positionY;
@property (nonatomic, strong) NSArray<NSString *> *rotate;

- (void)releaseCachedPath;
- (CGPathRef)getGroupPath:(CGContextRef)context;
- (CTFontRef)getFontFromContext;
- (NSString*) getAlignmentBaseline;
- (NSString*) getBaselineShift;

@end
