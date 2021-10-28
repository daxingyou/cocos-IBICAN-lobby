//
//  MyHttpConnection.m
//  lobby-mobile
//
//  Created by MacOS on 2019/6/13.
//

#import "MyHttpConnection.h"
#import "MyHttpResponse.h"

@implementation MyHttpConnection
    
- (NSObject<HTTPResponse> *)httpResponseForMethod:(NSString *)method URI:(NSString *)path {
    NSLog(@"%@: %@", method, path);
    
    if ([path isEqualToString:@"/"]) { // 如果请求的是首页
        return [[MyHttpResponse alloc] initWithFilePath:[self filePathForURI:path] forConnection:self];
    } else {
        return [super httpResponseForMethod:method URI:path];
    }
}
    
@end
