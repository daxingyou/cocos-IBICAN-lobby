//
//  MyHttpResponse.m
//  lobby-mobile
//
//  Created by MacOS on 2019/6/13.
//

#import "MyHttpResponse.h"

@implementation MyHttpResponse

//添加相应头ContentType
- (NSDictionary *)httpHeaders {
    NSLog(@"setHeader");
    return @{@"Content-Type": @"text/html; charset=utf-8"};
}
    
@end
