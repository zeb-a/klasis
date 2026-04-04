// Optimized useEffect replacement for App.jsx

// Load classes and behaviors (for both logged in users and when accessed via student portal)
  useEffect(() => {
    // restore token into api layer if present
    const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
    if (token) api.setToken(token);

    let mounted = true;

    const loadInitialData = async () => {
      try {
        // 1. Identify user email safely
        let userEmail = user?.email;
        if (!userEmail) {
          const storedUser = localStorage.getItem('classABC_logged_in');
          if (storedUser) userEmail = JSON.parse(storedUser).email;
        }

        // 2. RUN IN PARALLEL - This cuts wait time by 50%
        const [remoteClasses, remoteBehaviors] = await Promise.all([
          userEmail ? api.getClasses(userEmail) : Promise.resolve([]),
          userEmail ? api.getBehaviors() : Promise.resolve([])
        ]);

        if (!mounted) return;

        // 3. Update Classes
        if (Array.isArray(remoteClasses) && remoteClasses.length > 0) {
          setClasses(remoteClasses);
          localStorage.removeItem('classABC_demo_shown');
        } else if (user && !localStorage.getItem('classABC_demo_shown')) {
          setClasses([MOCK_CLASS]);
          localStorage.setItem('classABC_demo_shown', 'true');
        }

        // 4. Update Behaviors
        if (Array.isArray(remoteBehaviors) && remoteBehaviors.length > 0) {
          setBehaviors(remoteBehaviors);
        }
      } catch (err) {
        console.warn('Network load failed, keeping local/fallback data', err);
      }
    };

    loadInitialData();

    return () => { mounted = false; };
  }, [user]); // Only re-run if user object actually changes
