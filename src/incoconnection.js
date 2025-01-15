import dummyData from './dummy_data.json';

let NOHARDWARE = true;

let session = null;

export async function incoconnect(url) {
    if (NOHARDWARE) {
        console.log("run in nohardware mode");
        return;
    }

    if (session) {
        console.log("INCO V Session already open");
        return;
    }

    try {
        session = await incov.createSession(url);
        console.log("Connected To INCO V");

        session.getVariable("Target.Cpu").then((result) => {
            console.log("Indel CPU Type: " + result.value.value);
            return;
        });
    } catch (error) {
        console.error("Creating INCOV session failed: " + error);
    }
}

export function incodisconnect() {
    if (NOHARDWARE) {
        return;
    }

    if (session) {
        try {
            session.destroy();
            session = null;
        } catch (error) {
            console.error("Creating INCOV session failed: " + error);
        }
    }
}

export async function incoclassmemusage() {
    if (NOHARDWARE) {
        ret = dummyData;
        for (const key in ret.classes) {
            ret.classes[key].memory += Math.floor(Math.random() * 100);
            ret.classes[key].count += Math.floor(Math.random() * 10);
        }
        ret.alloc += Math.floor(Math.random() * 1000000);
        ret.used += Math.floor(Math.random() * 100000);
        return ret;
    }

    var ret = new Object();
    if (!session) {
        console.log("INCO V Session not open");
        return ret;
    }

    var allocatedmem = 0;
    var usedmem = 0;
    var classmem = new Object();
    try {
        const partitions = await session.getTree(
            "Target.Memory.Pools.Heap.Partitions",
        );
        for (const [key, value] of Object.entries(partitions.members)) {
            const classes = await session.getTree(
                "Target.Memory.Pools.Heap.Partitions." + key + ".Classes",
            );
            const actsize = await session.getVariable(
                "Target.Memory.Pools.Heap.Partitions." + key + ".ActSize",
            );
            const usedsize = await session.getVariable(
                "Target.Memory.Pools.Heap.Partitions." + key + ".UsedSize",
            );
            allocatedmem += actsize.value.value * key;
            usedmem += usedsize.value.value * key;
            for (const [classKey, classValue] of Object.entries(classes.members,)) {
                if (classValue.value.value === "Count unavailable") {
                    continue;
                }
                if (classKey in classmem) {
                    classmem[classKey].memory += key * classValue.value.value;
                    classmem[classKey].count += classValue.value.value;
                } else {
                    classmem[classKey] = {
                        memory: key * classValue.value.value,
                        count: classValue.value.value
                    };
                }
            }
        }
    } catch (error) {
        console.error("Error fetching Heap Tree:", error);
    }
    ret = {
        alloc: allocatedmem,
        used: usedmem,
        classes: classmem,
    }
    console.log(ret);
    return ret;
}

export async function incototalmem() {
    if (NOHARDWARE) {
        return 128000000;
    }

    return session.getVariable("Target.Memory.Pools.Heap.Size").then((size) => {
        return size.value.value;
    });
}

export async function incousedmem() {
    if (NOHARDWARE) {
        return Math.floor(Math.random() * 128);
    }

    return session.getVariable("Target.Memory.Pools.Heap.FreeSize").then((freeSize) => {
        return session.getVariable("Target.Memory.Pools.Heap.Size").then((size) => {
            return (size.value.value - freeSize.value.value) / 1000;
        });
    });
}
