/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  CordovaExample
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    [GeoSpark intialize:@"YOUR-PUBLISHABLE-KEY"];
    [GeoSpark trackLocationInAppState:[[NSArray alloc] initWithObjects:GSAppState.AlwaysOn, nil]];
    [GeoSpark setDelegate:self];
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if( !error ) {
        dispatch_async(dispatch_get_main_queue(), ^{
          [[UIApplication sharedApplication] registerForRemoteNotifications];
          NSLog( @"Push registration success." );
          
        });
        //      }
      } else {
        NSLog( @"Push registration FAILED" );
        NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
        NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
      }
    }];

    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


- (void)didUpdateLocation:(GSLocation *)location {
  NSLog(@"didUpdate %@",location.userId);
  NSLog(@"didUpdateLocation %f",location.latitude);
  NSLog(@"didUpdateLocation %f",location.longitude);
}

- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSLog(@"deviceToken: %@", deviceToken);
  [GeoSpark setDeviceToken:deviceToken];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
  [GeoSpark notificationOpenedHandler:response];
  completionHandler();
}

@end
