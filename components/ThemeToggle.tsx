import * as React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import type { EdgeInsets } from 'react-native-safe-area-context';

const contentInsets: EdgeInsets = {
  top: 16,
  bottom: 16,
  left: 16,
  right: 16,
};

function AvatarDropdown() {
  // Define os insets manualmente ou use algum hook/contexto que retorne isso

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Text>Open</Text>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        forceMount
        insets={contentInsets}
        className="w-64 native:w-72"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>Team</Text>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Text>Invite users</Text>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent forceMount>
              <Animated.View entering={FadeIn.duration(200)}>
                <DropdownMenuItem>
                  <Text>Email</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Message</Text>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Text>More...</Text>
                </DropdownMenuItem>
              </Animated.View>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Text>New Team</Text>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Text>GitHub</Text>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Text>Support</Text>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Text>API</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Text>Log out</Text>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AvatarDropdown;
