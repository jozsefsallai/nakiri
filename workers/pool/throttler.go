package pool

import (
	"sync"
	"time"
)

// Throttler is a utility for throttling the process of dispatching to channels
// (i.e. in worker jobs). The `MaxInvocation` parameter defines the maximum
// number of invocations that can be made before the throttler will sleep for a
// period of time. The `Delay` parameter defines the length of time that the
// throttler will sleep before allowing another invocation.
type Throttler struct {
	Invocations    int
	MaxInvocations int
	Delay          time.Duration
	Mutex          sync.Mutex
}

// Throttle will unlock the mutex for the current throttler and increase the
// number of invocations. If the number of invocations is greater than the
// maximum number of invocations, the throttler will sleep for the specified
// delay.
func (t *Throttler) Throttle() {
	t.Mutex.Lock()
	defer t.Mutex.Unlock()

	t.Invocations++

	if t.Invocations >= t.MaxInvocations {
		<-time.After(t.Delay)
		t.Invocations = 0
	}
}
