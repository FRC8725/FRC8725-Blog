<!-- title: 進階內容 Command -->
<!-- description: Command -->
<!-- category: Advance -->
<!-- tags: Programming -->
<!-- published time: 2024/03/23 -->

## Commands指令類別
### Command Group
#### SequentialCommandGroup
* (Command1, Command2) 1執行完執行2 指令依序執行

#### ParallelCommandGroup
* (Command1, Command2) 1&2同時執行

#### ParallelRaceGroup
* (Command1, Command2) 1&2同時執行 其中一個執行完終止全部指令

### Commands
* `Commands.run(action, requiredments)` 要執行的動作、對應的subsystem （執行到被中斷）
* `Commands.runEnd(run, runEnd, requirements) ` 要執行的動作、結束時執行的動作、對應的subsystem （運行命令直到中斷，接著運行第二個命令）
* `Commands.runOnce(action, requirements)` 要執行的動作、對應的subsystem （只執行一次操作）

### WaitCommand
* `new WaitCommand(seconds)` 不會執行任何操作，在指定持續時間後結束
